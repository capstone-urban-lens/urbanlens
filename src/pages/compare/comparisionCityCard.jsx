import { Typography, Snackbar, Alert } from "@mui/material";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Box,
  useTheme,
  Grid
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EastIcon from '@mui/icons-material/East';
import { IoIosGitCompare } from "react-icons/io";
import { IoMdGitCompare } from "react-icons/io";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


//and change the useState for a state that will persist for user logged in status and beyond refreshes

function cityCard({ title, abbrev, qol, image, population, climate, price, commute, cost_living, slug,  }) {

    const [bookmarked, setBookmarked] = useState(false);
    const [liked, setLiked] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    const showAlert = (msg) => {
        setAlertMsg(null);
        setTimeout(() => setAlertMsg(msg), 100);
    };

    const theme = useTheme();
    const navigate = useNavigate();

    
    return (
        <>
        <Card
        sx={{
            width: {xs: '97%', md: '100%'},
            maxWidth: {xs: 340, lg: 400, xl: 450},
            ml: {xs: '-10px'},
            mx: {md: 6},
            borderRadius: 2,
            overflow: "hidden",
            boxSizing: 'border-box',
            boxShadow: 4,
            display: 'block',
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
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="body3" fontWeight={600}>
            {title}, {abbrev}
          </Typography>
          {[
            { label: "Overall Quality of Life Score", value: qol, highlight: true },
            { label: "Population", value: population },
            { label: "Climate", value: climate },
            { label: "Avg. Home Price", value: price },
            { label: "Avg. Commute", value: commute },
            { label: "Cost of Living", value: cost_living },
        ].map((item) => (
            <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography variant="body2" fontWeight={item.highlight ? 700 : 500} sx={{ opacity: 0.9, ...(item.highlight ? { textDecoration: "underline" } : {}) }}>{item.label}:</Typography>
            <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
            </Box>
        ))}
        </CardContent>
        <Box
        component={Link}
        to={`/citydetails/${slug}`}
        sx={{ color: 'white',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            px: 2,
         }}
        >
            <Typography variant="body2" fontWeight={800} sx={{
                
            }}>View More Details</Typography>
            <IconButton
                size="small"
                sx={{ color: 'white',
                pl: 1,
                 }}
            >
                <EastIcon />
            </IconButton>
        </Box>
        <Box
        sx={{
            display: 'flex',
            px: 2,
        }}
        >
            <Typography variant="body1">
            *All Costs are avg monthly costs based on collected data
            </Typography>
        </Box>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            pt: 0,
          }}
        >
          <IconButton onClick={(e) => { e.preventDefault(); setBookmarked(!bookmarked); showAlert(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks'); }} sx={{ color: theme.palette.accent.main }}>
            {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton onClick={(e) => { e.preventDefault(); setLiked(!liked); showAlert(liked ? 'Removed from favorites' : 'Added to favorites'); }} sx={{ color: theme.palette.accent.main }}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: theme.palette.accent.main }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/communityboard/${slug}`); }}
          >
            <ChatBubbleOutlineOutlinedIcon />
          </IconButton>
          {/* <IconButton onClick={(e) => { e.preventDefault(); onCompare(slug); }} sx={{ color: theme.palette.accent.main }}>
            {isComparing ? <IoMdGitCompare /> : <IoIosGitCompare /> }
          </IconButton> */}
        </CardActions>
        
      </Box>
    </Card>
    <Snackbar
        open={!!alertMsg}
        autoHideDuration={2500}
        onClose={() => setAlertMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        <Alert onClose={() => setAlertMsg(null)} severity="success" variant="standard">
            {alertMsg}
        </Alert>
    </Snackbar>
    </>
    )
};
export default cityCard;