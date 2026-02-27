import Typography from "@mui/material/Typography";
import { Box, Button, InputAdornment, TextField, IconButton, Alert } from "@mui/material";
import background from "../../assets/img/login-bg.jpg";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { logIn } from "../../services/auth";

function login () {

    const theme = useTheme();
    const navigate = useNavigate();

    const [showPw, setShowPw] = useState(false);
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClickShowPw = () => setShowPw((show) => !show);
    const handleMouseDownPw = (e) => {
        e.preventDefault();
    };
    const handleMouseUpPw = (e) => {
        e.preventDefault();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await logIn(email, pw);
            navigate('/account')
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
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
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
                <Typography variant="h2" color="text">Log In</Typography>
                <Box component="form" onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3,
                    width: '70%',
                }}
                >
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField id="email" label="email" variant="filled" required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                        input: {
                            sx: {
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                '&:before, &:after': { display: 'none' },
                            },
                        },
                    }} />
                    <TextField id="pw" label="password" variant="filled" required type={showPw ? 'text' : 'password'}
                    value={pw} 
                    onChange={(e) => setPw(e.target.value)}
                    slotProps={{
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
                    size="large"
                    type="submit"
                    disabled={isSubmitting}
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
                    marginTop: '3rem',
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