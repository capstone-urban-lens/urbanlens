import { Box, Typography, Grid, Avatar, CircularProgress, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import CommunityMsg from "../community/communityMsg.jsx";
import CityCard from "../../components/cityCard.jsx";
import { getProfile, getProfilePicUrl } from "../../services/profiles";
import { getUserComments } from "../../services/comments.js";
import { getCities, getCityImageUrl } from "../../services/myCities";
import defaultPfp from "../../assets/img/default_pfp.jpg";

function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, commentsData, allCities] = await Promise.all([
          getProfile(userId),
          getUserComments(userId),
          getCities(),
        ]);
        setProfile(profileData);
        setComments(commentsData);
        const bookmarks = profileData.bookmarks ?? [];
        setSavedCities(allCities.filter(c => bookmarks.includes(c.slug)));
      } catch (err) {
        console.error('Failed to load profile:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ pt: 10, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">User not found.</Typography>
      </Box>
    );
  }

  const displayName = `${profile.fname ?? ''} ${profile.lname ?? ''}`.trim();
  const avatarSrc = profile.profile_pic ? getProfilePicUrl(profile.profile_pic) : defaultPfp;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 4, ml: { xs: 2, md: 4 } }}>

      <Button
        color="accent"
        variant="contained"
        size="medium"
        onClick={() => navigate(-1)}
        sx={{ fontWeight: 600, fontFamily: "'Libre Baskerville'", fontSize: '0.8rem', alignSelf: 'flex-start', mb: 2,}}
      >
        <ArrowBackIcon sx={{ fontSize: '1.1rem', mr: 0.5 }} />
        Back to Community Board
      </Button>

      {/* Avatar + Name */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3, mt: 2 }}>
        <Avatar src={avatarSrc} sx={{ width: 200, height: 200, flexShrink: 0 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body3" color="text">{displayName}</Typography>
        </Box>
      </Box>

      {/* Bio */}
      <Typography variant="body3" color="text" sx={{ mt: 3, mb: 1 }}>Bio</Typography>
      <Typography
        variant="body2"
        sx={{
          backgroundColor: 'rgba(144, 170, 85, 0.15)',
          maxWidth: { xs: '80vw', md: '45vw' },
          padding: 3,
          borderRadius: 3,
          fontStyle: profile.bio ? 'normal' : 'italic',
          color: profile.bio ? 'inherit' : 'text.secondary',
        }}
      >
        {profile.bio || 'This user hasn\'t written a bio yet.'}
      </Typography>

      {/* Saved Cities */}
      <Box sx={{ my: 2, backgroundColor: '#ffffff', px: { xs: 1 }, pl: { md: 2 }, pb: 3, borderRadius: 3, width: { xs: '90vw', md: '70vw' } }}>
        <Typography variant="h2" color="text" sx={{ pt: 2 }}>Saved Cities</Typography>
        <Grid
          container
          gap={3}
          sx={{
            mt: 2,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 2,
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.palette.primary.main} transparent`,
          }}
        >
          {savedCities.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
              No saved cities yet.
            </Typography>
          ) : savedCities.map((city) => (
            <Grid key={city.id} sx={{ flexShrink: 0, width: 300 }}>
              <CityCard
                title={city.title}
                abbrev={city.abbrev}
                image={getCityImageUrl(city.slug, 1)}
                subtitle={city.subtitle}
                slug={city.slug}
                defaultBookmarked={false}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Posts */}
      <Box sx={{ my: 2, backgroundColor: '#ffffff', px: { xs: 1 }, pl: { md: 2 }, pb: 3, borderRadius: 3, width: { xs: '90vw', md: '70vw' } }}>
        <Typography variant="h2" color="text" sx={{ pt: 2 }}>Posts</Typography>
        <Grid
          container
          columnGap={{ lg: 2 }}
          rowGap={{ xs: 3, md: 3 }}
          sx={{
            mt: 2,
            flexWrap: { lg: 'nowrap' },
            overflowX: { lg: 'auto' },
            pb: { lg: 2 },
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.palette.primary.main} transparent`,
          }}
        >
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
              No posts yet.
            </Typography>
          ) : comments.map((comment) => (
            <Grid size={{ xs: 12, md: 6, xl: 4 }} key={comment.comment_id} sx={{ flexShrink: { lg: 0 } }}>
              <CommunityMsg
                fullWidth
                name={displayName}
                image={avatarSrc}
                date={new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                message={comment.msg}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

    </Box>
  );
}

export default PublicProfile;
