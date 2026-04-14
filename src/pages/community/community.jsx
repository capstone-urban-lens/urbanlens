import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCities, getCityBySlug, getCityImageUrl } from "../../services/myCities";
import { getComments, postComment, updateComment, deleteComment } from "../../services/comments.js";
import { getProfilePicUrl } from "../../services/profiles.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Box, Typography, Button, useTheme, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
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
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
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
        setCities([...citiesData].sort((a, b) => a.title.localeCompare(b.title)));
        setCity(cityData);
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to fetch city data:', err.message);
      }
    }
    fetchData();
    setOption(citySlug);
  }, [citySlug]);

  async function confirmDeleteComment() {
    try {
      await deleteComment(pendingDeleteId);
      setComments(prev => prev.filter(c => c.comment_id !== pendingDeleteId && c.parent_id !== pendingDeleteId));
    } catch (err) {
      setAlertMsg('Failed to delete comment');
    } finally {
      setPendingDeleteId(null);
    }
  }

  async function handleEditComment(commentId, newMsg) {
    const original = comments.find(c => c.comment_id === commentId);
    setComments(prev => prev.map(c => c.comment_id === commentId ? { ...c, msg: newMsg } : c));
    try {
      const updated = await updateComment(commentId, newMsg);
      setComments(prev => prev.map(c => c.comment_id === commentId ? updated : c));
    } catch (err) {
      setComments(prev => prev.map(c => c.comment_id === commentId ? original : c));
      setAlertMsg('Failed to save edit');
    }
  }

  async function handleReplyComment(parentId, msg) {
    try {
      const reply = await postComment(city.city_id, user.id, msg, parentId);
      setComments(prev => [...prev, reply]);
    } catch (err) {
      setAlertMsg('Failed to post reply');
    }
  }

  async function handlePostComment(e) {
    e.preventDefault();
    if (!user) {
      setAlertMsg('Please log in to post a comment');
      return;
    }
    if (!newComment.trim()) {
      setAlertMsg('Empty comments cannot be posted');
      return;
    }
    const comment = await postComment(city.city_id, user.id, newComment);
    setComments(prev => [comment, ...prev]);
    setNewComment("");
  }

  if (!city) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress color="primary" aria-label="loading" />
      </Box>
    );
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
                  {c.title}, {c.abbrev}
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
            >{city.title}, {city.abbrev}</Typography>
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
              {comments.filter(c => !c.parent_id).map((comment) => (
                <Box key={comment.comment_id} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <CommunityMsg
                    name={`${comment.profiles.fname} ${comment.profiles.lname}`}
                    image={getProfilePicUrl(comment.profiles.profile_pic)}
                    date={new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    message={comment.msg}
                    isOwner={user && comment.user_id === user.id}
                    onDelete={() => setPendingDeleteId(comment.comment_id)}
                    onEdit={(newMsg) => handleEditComment(comment.comment_id, newMsg)}
                    onReply={user && comment.user_id !== user.id ? (msg) => handleReplyComment(comment.comment_id, msg) : undefined}
                  />
                  {comments.filter(r => r.parent_id === comment.comment_id).map((reply) => (
                    <Box key={reply.comment_id} sx={{
                      ml: { xs: 4, md: 6 },
                      pl: 2,
                      borderLeft: `3px solid ${theme.palette.secondary.main}`,
                    }}>
                      <Typography variant="body1" sx={{
                        color: theme.palette.secondary.main,
                        fontFamily: 'Pontano Sans',
                        mb: 0.5,
                      }}>
                        ↩ Reply
                      </Typography>
                      <CommunityMsg
                        name={`${reply.profiles.fname} ${reply.profiles.lname}`}
                        image={getProfilePicUrl(reply.profiles.profile_pic)}
                        date={new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                        message={reply.msg}
                        isOwner={user && reply.user_id === user.id}
                        onDelete={() => setPendingDeleteId(reply.comment_id)}
                        onEdit={(newMsg) => handleEditComment(reply.comment_id, newMsg)}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>


        </Box>
        
      </Box>
      <Dialog
        open={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        PaperProps={{
          sx: {
            backgroundColor: '#fcfbf6',
            borderRadius: 2,
            px: 1,
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Libre Baskerville', color: theme.palette.primary.main }}>
          Delete comment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Pontano Sans', color: '#646464' }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button onClick={() => setPendingDeleteId(null)} sx={{ color: '#646464' }}>Cancel</Button>
          <Button
            onClick={confirmDeleteComment}
            variant="contained"
            sx={{ backgroundColor: theme.palette.accent.main, color: theme.palette.text.main }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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