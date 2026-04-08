import { Box, Typography, Grid, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { LuReply } from "react-icons/lu";
import theme from "../../theme";



function communityMsg({ name, image, date, message, fullWidth, isOwner=false, onDelete }) {


    return (
        <>
        <Box
        sx={{
            backgroundColor: 'rgba(144, 170, 85, 0.15)',
            height: '100%',
            minHeight: '20vh',
            width: fullWidth ? '95%' : {xs: '80vw', md: '40vw'},
            borderRadius: 2,
            pb: 2,
            pr: 2,
        }}
        >
            <Grid container>
                <Grid size={{ xs: 12, md: 12}}>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'}
                    }}
                    >
                        <Box
                        component="img"
                        src={image}
                        alt={name}
                        sx={{
                            mt: 3,
                            ml: 2,
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                        ></Box>
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            ml: 3,
                            mt: 2,
                            flex: 1,
                        }}
                        
                        >
                            <Typography variant="body3" color="primary" sx={{ fontSize: '1.4rem'}}>
                                {name}
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: '#646464'
                            }}>
                                {date}
                            </Typography>
                            <Typography variant="body2" color="text">
                                {message}
                            </Typography>
                            <Box
                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
                            >
                                <IconButton sx={{ color: theme.palette.primary.main }}>
                                    <LuReply />
                                </IconButton>
                                {isOwner && (
                                    <IconButton onClick={onDelete} sx={{ color: theme.palette.primary.main }}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </Box>
        </>
    )
} export default communityMsg;