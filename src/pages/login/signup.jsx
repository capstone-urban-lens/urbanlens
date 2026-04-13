import Typography from "@mui/material/Typography";
import { Box, Button, InputAdornment, TextField, IconButton, Snackbar, Alert, CircularProgress } from "@mui/material";
import background from "../../assets/img/login-bg.jpg";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { signUp } from "../../services/auth";


function Signup () {

    const theme = useTheme();
    const navigate = useNavigate();
    const [showPw, setShowPw] = useState(false);
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [confirmPw, setConfirmPw] = useState('');

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [alertMsg, setAlertMsg] = useState(null);

    const showAlert = (msg) => {
        setAlertMsg(null);
        setTimeout(() => setAlertMsg(msg), 100);
    };
    const handleClickShowPw = () => setShowPw((show) => !show);
    const handleMouseDownPw = (e) => {
        e.preventDefault();
    };
    const handleMouseUpPw = (e) => {
        e.preventDefault();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (pw !== confirmPw) {
            setError("Passwords do not match");
            return;
        }
        setIsSubmitting(true);
        try {
            const data = await signUp(email, pw, fname, lname);
            if (data.session) {
                showAlert('Account created successfully!');
                setTimeout(() => navigate('/account'), 1500);
            } else {
                setError('Account creation failed. Please try again.'); //swap this line to check email if email confirmation is enabled later
                setIsSubmitting(false);
            }
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
                height: 'auto',
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
                <Typography variant="h2" color="text">Sign Up</Typography>
                <Box component="form" onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3,
                    width: '70%',
                }}
                >   
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField id="fname" label="first name" variant="filled" required 
                    value={fname}
                    onChange={(e) => setFname (e.target.value)}
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
                    <TextField id="lname" label="last name" variant="filled" required 
                    value={lname}
                    onChange={(e) => setLname (e.target.value)}
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
                    <TextField id="email" label="email" variant="filled" required 
                    value={email}
                    onChange={(e) => setEmail (e.target.value)}
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
                    <TextField id="pw" label="password" variant="filled" required 
                    value={pw}
                    onChange={(e) => setPw (e.target.value)}
                    type={showPw ? 'text' : 'password'} slotProps={{
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
                    <TextField id="confirmpw" label="confirm password" variant="filled" required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    type={showPw ? 'text' : 'password'} 
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
                        mt: 2,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.background.main,
                        fontSize: '1.2rem'
                    }}
                    >
                    {isSubmitting ? <CircularProgress size={20} color="inherit" aria-label="loading" /> : 'Submit'}
                    </Button>

                </Box>
            </Box>
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
        </>
    )
} 
export default Signup;

