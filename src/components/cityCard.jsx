import { Typography, Snackbar, Alert } from "@mui/material";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Box,
  useTheme
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { IoIosGitCompare } from "react-icons/io";
import { IoMdGitCompare } from "react-icons/io";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBookmarks } from "../context/BookmarksContext";
import { useAuth } from "../context/AuthContext";



function cityCard({ title, abbrev, subtitle, image, slug, onCompare, isComparing }) {

    const { isBookmarked, toggle } = useBookmarks();
    const { user } = useAuth();
    const [alertMsg, setAlertMsg] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState('success');

    const showAlert = (msg, severity = 'success') => {
        setAlertSeverity(severity);
        setAlertMsg(null);
        setTimeout(() => setAlertMsg(msg), 100);
    };

    const handleBookmark = async (e) => {
        e.preventDefault();
        if (!user) {
            showAlert('Sign in to bookmark cities', 'info');
            return;
        }
        const wasBookmarked = isBookmarked(slug);
        try {
            await toggle(slug);
            showAlert(wasBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', wasBookmarked ? 'info' : 'success');
        } catch {
            showAlert('Failed to update bookmark', 'error');
        }
    };

    const theme = useTheme();
    const navigate = useNavigate();

    
    return (
        <>
        <Card component={Link} to={`/citydetails/${slug}`}
        sx={{
            width: "100%",
            maxWidth: 340,
            height: '100%',
            mx: 'auto',
            borderRadius: 2,
            overflow: "hidden",
            boxSizing: 'border-box',
            cursor: 'pointer',
            boxShadow: 4,
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
                boxShadow: '0 0 30px rgba(151, 208, 113, 0.6)'
            }
        }} 
        >
      {/* Image */}
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover',
            
        }}
      />

      {/* Green body area */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          //px: 2,
          py: 1,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="body3" fontWeight={600}>
            {title}, {abbrev}
          </Typography>

          <Typography
            variant="body2"
            sx={{ opacity: 0.9, mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            pt: 0,
            mt: 'auto',
          }}
        >
          <IconButton onClick={handleBookmark} sx={{ color: theme.palette.accent.main }}>
            {isBookmarked(slug) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: theme.palette.accent.main }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/communityboard/${slug}`); }}
          >
            <ChatBubbleOutlineOutlinedIcon />
          </IconButton>
          <IconButton onClick={(e) => { e.preventDefault(); onCompare(slug); }} sx={{ color: theme.palette.accent.main }}>
            {isComparing ? <IoMdGitCompare /> : <IoIosGitCompare /> }
          </IconButton>
        </CardActions>
      </Box>
    </Card>
    <Snackbar
        open={!!alertMsg}
        autoHideDuration={2500}
        onClose={() => setAlertMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        <Alert onClose={() => setAlertMsg(null)} severity={alertSeverity} variant="standard">
            {alertMsg}
        </Alert>
    </Snackbar>
    </>
    )
};
export default cityCard;