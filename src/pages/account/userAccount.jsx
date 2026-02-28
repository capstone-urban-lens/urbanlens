import { Box, Typography, Grid, Snackbar, Alert, Avatar, IconButton, TextField, Button, CircularProgress, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Cities from "../../components/citiesInfo";
import CityCard from "../../components/cityCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import replies from "../../components/mockComments.js";
import CommunityMsg from "../community/communityMsg.jsx";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, uploadAvatar, getProfilePicUrl } from "../../services/profiles";
import defaultPfp from "../../assets/img/default_pfp.jpg";

function UserAccount() {
  const myCities = Cities.slice(6, 8);
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
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
      const city = Cities.find((c) => c.slug === slug);
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
            gap={{ xs: 3, md: 0 }}
            sx={{
              px: { md: 0 },
              mt: 2,
            }}
          >
            {myCities.map((city) => (
              <Grid
                size={{ xs: 12, md: 6 }}
                key={city.id}
                sx={{ "& > a": { mx: 0 } }}
              >
                <CityCard
                  title={city.title}
                  image={city.img}
                  subtitle={city.subtitle}
                  slug={city.slug}
                  defaultBookmarked={true}
                  defaultLiked={true}
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
            Liked Posts
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
            {replies.map((reply) => (
              <Grid
                size={{ xs: 12, md: 6, xl: 4, }}
                key={reply.id}
                sx={{ flexShrink: { lg: 0 } }}
              >
                <CommunityMsg
                  name={reply.name}
                  image={reply.image}
                  date={reply.date}
                  message={reply.msg}
                  fullWidth
                  defaultLiked={true}

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
