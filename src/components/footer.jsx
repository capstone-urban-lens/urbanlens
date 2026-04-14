import { Box, Grid, Typography, Link, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import logo from '../assets/img/logo.png';


function Footer () {
    const theme = useTheme();

    return (
        <>
        <Box
         component="footer"
         sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            px: { xs: 3, md: 8 },
            pt: 0,
            pb: { xs: 2, md: 0}, 
            mt: { xs: 6, lg: 12, },
         }}
        >
            <Grid container spacing={2} alignItems="center" textAlign={{xs: 'center', md: 'left'}}>
                <Grid size={{ xs: 12, md: 6, lg: 3}}>
                    <Box
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'center' },
                        gap: 2,
                        }}
                    >
                    <Box
                    component="img"
                    src={logo}
                    alt="Urban Lens Key-shaped Logo"
                    sx={{ width: { xs: '60%', sm: '50%', md: '70%', lg: '80%', }, maxWidth: 250, height: 'auto', mt: {xs: 1} }}
                    />  
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 7}}
                sx={{
                    mt: {xs: 0, lg: 3,}
                }}
                >
                    <Grid container spacing={1} justifyContent="center">
                        <Grid size={{ xs: 12, lg: 4}}>
                            <FooterLink to="/explore">Explore Areas</FooterLink>
                            <FooterLink to="/communityboard">Community Board</FooterLink>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 4}}>
                            <FooterLink to="/signup">Sign up</FooterLink>
                            <FooterLink to="/login">Log In</FooterLink>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 4}}>
                            {/* <Typography variant="body2">
                                Phone: (000) XXX-XXXX
                            </Typography> */}
                            {/* <Typography variant="body2">
                                Email: access@xxx.com
                            </Typography> */}
                            <Typography variant="body2">
                                This site is 
                            </Typography>
                            <Typography variant="body2">
                                for educational purposes only
                            </Typography>
                            
                        </Grid>
                    </Grid>
                </Grid>

                

            </Grid>
        </Box>
        
        </>
    )
} export default Footer;

function FooterLink({ to, children }) {
  return (
    <Link
      component={RouterLink}
      to={to}
      underline="none"
      color="inherit"
      sx={{
        display: 'block',
        mb: 1,
        fontSize: '1rem',
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      {children}
    </Link>
  );
}