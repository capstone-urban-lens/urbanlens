import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCities, getCityBySlug, getCityImageUrl } from "../../services/myCities";
import { getComments, postComment, deleteComment } from "../../services/comments.js";
import { getProfilePicUrl } from "../../services/profiles.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Box, Typography, Button, useTheme, Snackbar, Alert } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select  from '@mui/material/Select';
import CommunityMsg from "./communityMsg.jsx";
import TextField from '@mui/material/TextField';

//TODO about pagination 
//Backend TODO - consider incorporating counter for likes button 
//add ability for users to delete their own comments 

function community() {

  const { user } = useAuth();

  const [alertMsg, setAlertMsg] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [option, setOption] = useState(citySlug);

  useEffect(() => {
    async function fetchData() {
      try {
        const [citiesData, cityData] = await Promise.all([
          getCities(),
          getCityBySlug(citySlug),
        ]);
        const commentsData = await getComments(cityData.city_id);
        setCities(citiesData);
        setCity(cityData);
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to fetch city data:', err.message);
      }
    }
    fetchData();
    setOption(citySlug);
  }, [citySlug]);

  async function handleDeleteComment(commentId) {
    await deleteComment(commentId);
    setComments(comments.filter(c => c.comment_id !== commentId));
  }

  async function handlePostComment(e) {
    e.preventDefault();
    if (!user) {
      setAlertMsg('Please log in to post a comment');
      return;
    }
    const comment = await postComment(city.city_id, user.id, newComment);
    setComments([comment, ...comments]);
    setNewComment("");
  }

  if (!city) {
    return <h2>Loading...</h2>;
  }

  const handleChange = (e) => {
    const newSlug = e.target.value;
    setOption(newSlug);
    navigate(`/communityboard/${newSlug}`);
  };

  return (
    <>
      <Box
      sx={{
        pt: 5, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      >
        <Box
        sx={{
          width: { xs: '90vw', lg: '50vw' },
          mb: '5',
          display: 'flex',
          justifyContent: 'center',
        }}
        >
          <FormControl variant="filled" sx={{ width: '200px' }}>
            <InputLabel>City</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option}
              label="City"
              onChange={handleChange}
              sx={{ backgroundColor: 'rgba(120, 145, 116, 0.5)',
                
               }}
            >
              {cities.map((c) => (
                <MenuItem key={c.slug} value={c.slug}
                sx={{
                  fontFamily: " 'Pontano Sans', serif"
                }}
                >
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            width: {xs: '90vw', lg: '50vw'},
            mt: 5,
          }}
        >
          <Box
            component="img"
            src={getCityImageUrl(city.slug, 1)}
            alt={city.title}
            sx={{
              width: '100%',
              height: "auto",
              borderRadius: "10px",
            }}
          />
          <Button
              variant="contained"
              component={Link}
              size="large"
              to={`/citydetails/${citySlug}`}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.main,
              }}
            >
              City Details
            </Button>
            <Typography variant="h2" color="primary"
              sx={{ 
                my: 4,
                width: '50vw' 
              }}
            >{city.title}</Typography>
            <Typography variant="h3" color="primary"
            sx={{
              mb: 4,
            }}
            >
              Top Comments
            </Typography>
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
            >
              <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
              >
                <form onSubmit={handlePostComment}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px'
                  }}>
                  <TextField id="outlined-textarea" label="Add a Comment" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  multiline
                  sx={{
                    fontFamily: "'Pontano Sans', 'serif'",
                    width: {xs: '80vw', md: '40vw'},
                    fontSize: '1rem',
                  }}
                  />
                  <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.accent.main,
                  }}
                  type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </Box>
              {comments.map((comment) => (
                <CommunityMsg key={comment.comment_id}
                name={`${comment.profiles.fname} ${comment.profiles.lname}`}
                image={getProfilePicUrl(comment.profiles.profile_pic)}
                date={new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                message={comment.msg}
                isOwner={user && comment.user_id === user.id}
                onDelete={() => handleDeleteComment(comment.comment_id)}
                />
              ))}
            </Box>


        </Box>
        
      </Box>
      <Snackbar
        open={!!alertMsg}
        autoHideDuration={2500}
        onClose={() => setAlertMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setAlertMsg(null)} severity="error" variant="standard">
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default community;