import { Box, Typography, Grid, Snackbar, Alert, Avatar, IconButton, TextField, Button, CircularProgress, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CityCard from "../../components/cityCard";
import { getCities, getCityImageUrl } from "../../services/myCities";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CommunityMsg from "../community/communityMsg.jsx";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { useBookmarks } from "../../context/BookmarksContext";
import { getUserComments, deleteComment } from "../../services/comments.js";
import { getProfile, updateProfile, uploadAvatar, getProfilePicUrl } from "../../services/profiles";
import defaultPfp from "../../assets/img/default_pfp.jpg";


function UserAccount() {
  const theme = useTheme();
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userComments, setUserComments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [bioSaving, setBioSaving] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(null);

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    if (!user) return;
    setProfileLoading(true);
    getProfile(user.id)
      .then((data) => {
        setProfile(data);
        setBioValue(data.bio ?? "");
      })
      .catch((err) => setProfileError(err.message))
      .finally(() => setProfileLoading(false));
  }, [user]);

  useEffect(() => {
    setSavedLoading(true);
    if (bookmarks.length === 0) { setSavedCities([]); setSavedLoading(false); return; }
    getCities()
      .then((all) => {
        const filtered = all.filter((c) => bookmarks.includes(c.slug));
        filtered.sort((a, b) => bookmarks.indexOf(a.slug) - bookmarks.indexOf(b.slug));
        setSavedCities(filtered);
      })
      .catch((err) => console.error('Failed to load saved cities:', err.message))
      .finally(() => setSavedLoading(false));
  }, [bookmarks]);

  useEffect(() => {
    if (!user) return;
    getUserComments(user.id)
      .then((data) => setUserComments(data))
      .catch((err) => console.error(err.message));
  }, [user]);


  useEffect(() => {
    if (compareList.length === 2) {
      navigate(`/compare/${compareList[0]}/${compareList[1]}`);
      setCompareList([]);
    }
  }, [compareList, navigate]);

  const handleBioSave = async () => {
    setBioSaving(true);
    try {
      const updated = await updateProfile(user.id, { bio: bioValue });
      setProfile((prev) => ({ ...prev, bio: updated.bio }));
      setEditingBio(false);
      setAlertSeverity("success");
      setAlertMsg("Bio updated!");
    } catch (err) {
      setAlertSeverity("error");
      setAlertMsg(err.message);
    } finally {
      setBioSaving(false);
    }
  };

  const handleBioCancel = () => {
    setBioValue(profile?.bio ?? "");
    setEditingBio(false);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setUserComments(userComments.filter(c => c.comment_id !== commentId));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const path = await uploadAvatar(user.id, file);
      const updated = await updateProfile(user.id, { profile_pic: path });
      setProfile((prev) => ({ ...prev, profile_pic: updated.profile_pic }));
      setAvatarVersion(Date.now());
      setAlertSeverity("success");
      setAlertMsg("Profile picture updated!");
    } catch (err) {
      setAlertSeverity("error");
      setAlertMsg(err.message);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleCompare = (slug) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) {
        setAlertMsg(null);
        setTimeout(() => setAlertMsg("Removed from Comparision"), 100);
        return prev.filter((s) => s !== slug);
      }
      const updated = [...prev, slug];
      const city = savedCities.find((c) => c.slug === slug);
      if (updated.length < 2) {
        setAlertMsg(null);
        setTimeout(() =>
          setAlertMsg(
            `${city?.title || slug} selected - pick another city to compare`,
          ),
        );
      }
      return updated;
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: 4,
          ml: {xs: 0, md: 2},
        }}
      >
        <Typography variant="h2" color="text">
          Your Info
        </Typography>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            gap: 3,
            mt: 2,
          }}
        >
          {/* Avatar with upload overlay */}
          <Box sx={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
            <Avatar
              src={profile?.profile_pic ? getProfilePicUrl(profile.profile_pic, avatarVersion) : defaultPfp}
              sx={{ width: 200, height: 200 }}
            />
            <Tooltip title="Change profile picture">
              <Box
                onClick={handleAvatarClick}
                sx={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.35)", opacity: 0,
                  transition: "opacity 0.2s", cursor: "pointer",
                  "&:hover": { opacity: 1 },
                }}
              >
                {avatarUploading
                  ? <CircularProgress size={32} sx={{ color: "#fff" }} />
                  : <PhotoCameraIcon sx={{ color: "#fff", fontSize: 36 }} />}
              </Box>
            </Tooltip>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </Box>

          {/* Name & Email */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="body3" color="text">
              {profile ? `${profile.fname ?? ""} ${profile.lname ?? ""}`.trim() : ""}
            </Typography>
            <Typography variant="body1" color="primary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        {/* Bio label + pencil icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, mb: 1 }}>
          <Typography variant="body3" color="text">Bio</Typography>
          {!editingBio && (
            <IconButton size="small" onClick={() => setEditingBio(true)}>
              <EditIcon fontSize="medium" />
            </IconButton>
          )}
        </Box>

        {/* Bio — view or edit mode */}
        {editingBio ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              multiline
              minRows={4}
              fullWidth
              autoFocus
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              disabled={bioSaving}
              sx={{
                maxWidth: { xs: "80vw", md: "45vw" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(144, 170, 85, 0.15)",
                  borderRadius: 3,
                  "& fieldset": { borderColor: "rgba(144, 170, 85, 0.6)" },
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={bioSaving ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
                onClick={handleBioSave}
                disabled={bioSaving}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloseIcon />}
                onClick={handleBioCancel}
                disabled={bioSaving}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            onClick={() => setEditingBio(true)}
            sx={{
              backgroundColor: "rgba(144, 170, 85, 0.15)",
              maxWidth: { xs: "80vw", md: "45vw" },
              padding: 3,
              borderRadius: 3,
              cursor: "text",
              fontStyle: profile?.bio ? "normal" : "italic",
              color: profile?.bio ? "inherit" : "text.secondary",
            }}
          >
            {profile?.bio || "Share a little about yourself — your favorite city, way of living, or what brought you to UrbanLens."}
          </Typography>
        )}
        <Box
          sx={{
            my: 2,
            backgroundColor: "#ffffff",
            px: { xs: 1 },
            pl: { md: 2 },
            pb: 3,
            borderRadius: 3,
            width: { xs: "90vw", md: "70vw", xl: "70vw" },
            height: "auto",
          }}
        >
          <Typography variant="h2" color="text">
            Saved Cards
          </Typography>
          <Grid
            container
            gap={3}
            sx={{
              px: { md: 0 },
              mt: 2,
              flexWrap: "nowrap",
              overflowX: "auto",
              pb: 2,
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.primary.main} transparent`,
            }}
          >
            {savedLoading ? (
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress color="primary" size={28} />
                </Box>
              </Grid>
            ) : savedCities.length === 0 ? (
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
                  No saved cities yet. Bookmark a city to see it here.
                </Typography>
              </Grid>
            ) : savedCities.map((city) => (
              <Grid
                key={city.id}
                sx={{ flexShrink: 0, width: 300 }}
              >
                <CityCard
                  title={city.title}
                  abbrev={city.abbrev}
                  image={getCityImageUrl(city.slug, 1)}
                  subtitle={city.subtitle}
                  slug={city.slug}
                  defaultBookmarked={true}
                  onCompare={handleCompare}
                  isComparing={compareList.includes(city.slug)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            my: 2,
            backgroundColor: "#ffffff",
            px: { xs: 1 },
            pl: { md: 2 },
            pb: 3,
            borderRadius: 3,
            width: { xs: "90vw", md: "70vw", xl: "70vw" },
            height: "auto",
          }}
        >
          <Typography variant="h2" color="text">
            My Posts
          </Typography>
          <Grid
            container
            columnGap={{ lg: 2 }}
            rowGap={{ xs: 3, md: 3 }}
            sx={{
              px: { md: 0 },
              mt: 2,
              flexWrap: { lg: "nowrap" },
              overflowX: { lg: "auto" },
              pb: { lg: 2 },
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.primary.main} transparent`,
            }}
          >
            {userComments.map((comment) => (
              <Grid
                size={{ xs: 12, md: 6, xl: 4, }}
                key={comment.comment_id}
                sx={{ flexShrink: { lg: 0 } }}
              >
                <CommunityMsg
                fullWidth
                name={`${profile?.fname ?? ''} ${profile?.lname ?? ''}`.trim()}
                image={getProfilePicUrl(profile?.profile_pic)}
                date={new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                message={comment.msg}
                isOwner
                onDelete={() => handleDeleteComment(comment.comment_id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={!!alertMsg}
        autoHideDuration={2500}
        onClose={() => setAlertMsg(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertMsg(null)}
          severity={alertSeverity}
          variant="standard"
        >
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
export default UserAccount;
