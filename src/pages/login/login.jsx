import Typography from "@mui/material/Typography";
import { Box, Button, InputAdornment, TextField, IconButton } from "@mui/material";
import background from "../../assets/img/login-bg.jpg";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, useEffect } from "react";
import supabase from "../../services/supabase";

function login () {

    useEffect(() => {
        async function testConnection() {
            const { data, error } = await supabase.from('cities').select('*')
            if (error) {
            console.error('Supabase connection failed:', error.message)
            } else {
            console.log('Supabase connected! Data:', data)
            }
        }
        testConnection()
        }, [])

    const theme = useTheme();
    const [showPw, setShowPw] = useState(false);
    const handleClickShowPw = () => setShowPw((show) => !show);
    const handleMouseDownPw = (e) => {
        e.preventDefault();
    };
    const handleMouseUpPw = (e) => {
        e.preventDefault();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
        <Box
        sx={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '100vh',
            ml: '-10px',
            mb: '-2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

        }}
        >
            <Box
            sx={{ 
                backgroundColor: 'rgba(252, 251, 246, 0.65)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                borderRadius: 3,
                width: {xs: '90vw', md: '50vw'},
                height: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
                <Typography variant="h2" color="text">Login</Typography>
                <Box component="form" onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3,
                    width: '70%',
                }}
                >
                    <TextField id="email" label="email" variant="filled" required slotProps={{
                        input: {
                            sx: {
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                '&:before, &:after': { display: 'none' },
                            },
                        },
                    }} />
                    <TextField id="pw" label="password" variant="filled" required type={showPw ? 'text' : 'password'} slotProps={{
                        input: {
                            sx: {
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                '&:before, &:after': { display: 'none' },
                            },
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label={
                                        showPw ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPw}
                                    onMouseDown={handleMouseDownPw}
                                    onMouseUp={handleMouseUpPw}
                                    edge="end"
                                    >
                                    {showPw ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        },
                        }} 
                    />
                    <Button
                    variant="contained"
                    component={Link}
                    to="/account"
                    size="large"
                    type="submit"
                    sx={{
                        my: 2,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.background.main,
                        fontSize: '1.2rem'
                    }}
                    >
                    Submit
                    </Button>
                </Box>
                <Link
                to="/signup"
                style={{
                    margiTop: '3rem',
                    fontSize: '0.9rem',
                    color: theme.palette.text.main
                }}  
                >
                Create Account
                </Link>
            </Box>
        </Box>
        </>
    )
} 
export default login;