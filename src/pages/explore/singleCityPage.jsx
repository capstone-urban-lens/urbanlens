import { getCities, getCityBySlug, getCityImageUrl } from "../../services/myCities";
import { Box, Button, Typography, IconButton, useTheme, Snackbar, Alert, Grid } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from '@mui/icons-material/Bookmark';
// import { IoIosGitCompare } from "react-icons/io";
// import { IoMdGitCompare } from "react-icons/io";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

function SingleCityPage() {
    const { citySlug } = useParams();
    const [city, setCity] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [liked, setLiked] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    useEffect(() => {
      async function fetchCity() {
        try {
          const data = await getCityBySlug(citySlug);
          setCity(data);
        } catch (err) {
          console.error('Failed to fetch city:', err.message);
        }
      }
      fetchCity();
    }, [citySlug]);

    if (!city) {
      return <Typography variant="h2">Loading...</Typography>;
    }

    const showAlert = (msg) => {
        setAlertMsg(null);
        setTimeout(() => setAlertMsg(msg), 100);
    };

    const theme = useTheme();

    
    return (
        <>
        <Box
        sx={{
            
        }}
        >
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                py: '1.5rem',
                ml: '-10px',
            }}
            >
                <Box sx={{ width: {xs: '90vw', lg: '60vw'}, mt: 5 }}>
                    <Box
                    component="img"
                    src={getCityImageUrl(city.slug, 1)}
                    alt={city.title}
                    sx={{
                        width: '100%',
                        height: "auto",
                        borderRadius: "10px",
                        display: 'block',
                    }}
                    />
                    <Box sx={{ mt: 1 }}>
                        <IconButton onClick={() => { setBookmarked(!bookmarked); showAlert(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks'); }} sx={{ color: theme.palette.primary.main }}>
                            {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                        <IconButton onClick={() => { setLiked(!liked); showAlert(liked ? 'Removed from favorites' : 'Added to favorites'); }} sx={{ color: theme.palette.primary.main }}>
                            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
                        </IconButton>
                        <IconButton
                            component={Link}
                            to={`/communityboard/${citySlug}`}
                            size="small"
                            sx={{ color: theme.palette.primary.main }}
                        >
                            <ChatBubbleOutlineOutlinedIcon />
                        </IconButton>
                        {/* <IconButton onClick={() => { setCompared(!compare); showAlert('Select another city to compare'); }} sx={{ color: theme.palette.primary.main }}>
                            {compare ? <IoMdGitCompare /> : <IoIosGitCompare /> }
                        </IconButton> */}
                    </Box>
                    <Box>
                        <Typography variant="h2" color="primary"
                        sx={{ 
                            my: 4,
                        }}
                        >City Details - <em>{city.title}</em></Typography>
                        <Typography
                        variant="body2">{city.description}</Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.background.default,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        my: 3,
                        py: 5,
                        px: 2,
                    }}
                    >
                    <Typography variant="h2">City Snapshot</Typography>
                    <Typography variant="body2" sx={{ mt: 1, }}>
                        These key metrics offer a quick overview of what it’s like to live in this city.
                    </Typography>
                    <Grid container rowSpacing={{ md: 1,}} columnSpacing={{ md: 10, lg: 18, xl: 30 }}  sx={{ mt: 2,
                        width: {xs: '90vw', lg: '40vw', xl: '30vw', },
                        justifyContent: 'center',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row'},
                     }}>
                        {[
                            { label: 'Quality of Life', value: city.qol },
                            { label: 'Average Salary', value: city.salary },
                            { label: 'Cost Index', value: city.cost_index },
                            { label: 'Population', value: city.population },
                            { label: 'Climate', value: city.climate },
                            { label: 'Average Commute', value: city.avg_commute },
                            { label: 'Avg Cost of Living', value: city.avg_cost_of_living },
                            { label: '2 Bedroom Rent', value: city.br_rent },
                        ].map((item) => (
                            <Grid size={{ xs: 12, md: 6 }} key={item.label}>
                                <Typography variant="body2">• {item.label}: {item.value}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box
                sx={{
                    width: {xs: '90vw', lg: '60vw'},
                }}
                >
                    <Grid container>
                        <Grid item size={{ xs: 12, md: 6}}>
                            <Typography variant="h2" color="primary">What It's Known For</Typography>
                            <Typography variant="body2" color="text"
                            sx={{
                                my: 2,
                                pr: 2,
                            }}
                            >{city.information}</Typography>
                            <Button color="accent" variant="contained" component={Link}
                            to={`/communityboard/${citySlug}`}
                            sx={{
                                fontWeight: 600,
                                fontFamily: "'Libre Baskerville'",
                                fontSize: '1rem',
                                mb: {xs: 2, md: 0}
                            }}
                            >
                            Comment on this City 
                            </Button>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6}}
                        sx={{}}
                        >
                            <Box
                            component="img"
                            src={getCityImageUrl(city.slug, 2)}
                            alt={city.title}
                            sx={{
                            width: '100%',
                            height: "auto",
                            borderRadius: "10px",
                            display: 'block',
                            }}
                            />
                        </Grid>
                    </Grid>
                </Box>
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
                </Box>
            </Box>
        </>
    )
} export default SingleCityPage;