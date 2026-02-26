import { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Box, Button, Menu, MenuList, MenuItem } from "@mui/material";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../services/auth';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './navbar.css';
import keyLogo from '../assets/img/logo.png';
import SearchBar from './searchbar';
import { useAuth } from "../context/AuthContext";


const pages=[
    { label: 'Compare Cities', path: '/compare' },
    { label: 'Explore Areas', path: '/explore' },
    { label: 'Community Board', path: '/communityboard' },
];

function Navbar() {
    const [anchorNav, setAnchorNav] = useState(null);
    const [anchorAuth, setAnchorAuth] = useState(null);
    const [signingOut, setSigningOut] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const handleSignOut = async () => {
        if (signingOut) return;
        setSigningOut(true);
        closeAuthMenu();
        closeMenu();
        await signOut().catch(() => {});
        navigate('/login');
    };

    const openMenu = (event)=>{
        setAnchorNav(event.currentTarget);
    };
    const closeMenu=()=>{
        setAnchorNav(null);
    };

    const openAuthMenu = (event) => {
        setAnchorAuth(event.currentTarget);
    };
    const closeAuthMenu = () => {
        setAnchorAuth(null);
    };
    useEffect(() => {
        closeAuthMenu();
    }, [user]);

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{justifyContent: 'space-between', alignItems: 'center', px: {xs: 1, lg: 10, xl: 32}}}>
                    <Box sx={{display:{xs: 'flex', md: 'none'}, alignItems: 'center', gap: 1}}>
                        <IconButton size='large' edge='start' color='inherit' onClick={openMenu} aria-label='Open navigation menu'>
                            <MenuIcon
                            />
                        </IconButton>
                        <Menu anchorEl={anchorNav} open={Boolean(anchorNav)} onClose={closeMenu} sx={{display:{xs: 'flex', md: 'none'}}} disableScrollLock>
                            <MenuList>
                                {pages.map((page)=>(
                                    <MenuItem
                                    key={page.path}
                                    component={Link}
                                    to={page.path}
                                    onClick={closeMenu}
                                    sx={{
                                        fontFamily: '"Pontano Sans", sans-serif',
                                    }}
                                    >{page.label}
                                    </MenuItem>
                                ))}
                                {!loading && (user ? (
                                    <>
                                        <MenuItem component={Link} to={'/account'} onClick={closeMenu} sx={{ fontFamily: '"Pontano Sans", sans-serif' }}>My Account</MenuItem>
                                        <MenuItem onClick={handleSignOut} disabled={signingOut} sx={{ fontFamily: '"Pontano Sans", sans-serif' }}>Sign Out</MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem component={Link} to={'/login'} onClick={closeMenu} sx={{ fontFamily: '"Pontano Sans", sans-serif' }}>Log in</MenuItem>
                                        <MenuItem component={Link} to={'/signup'} onClick={closeMenu} sx={{ fontFamily: '"Pontano Sans", sans-serif' }}>Sign up</MenuItem>
                                    </>
                                ))}
                            </MenuList>
                        </Menu>
                        <SearchBar />
                    </Box>
                    <Box component={Link}
                        to="/" 
                        // sx={{display: {xs: 'none', md:'flex'}}} 
                        aria-label='logo'
                    >
                        <Box
                        component="img"
                        src={keyLogo}
                        alt="Urban Lens Key-shaped Logo"
                        sx={{
                            width: {
                                xs: 130,
                                lg: 180,
                                xl: 200
                            },
                            height: 'auto',
                            marginRight: {
                                md: 3,
                            }
                        }} />
                    </Box>

                    <Box sx={{
                        display:{xs: 'none', md: 'flex'},
                        gap: {md: 1, lg: 4},
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        }}>
                        {pages.map((page)=>(
                            <Button
                            key={page.path}
                            component={NavLink}
                            to={page.path}
                            sx={{ fontWeight: 'semi-bold',
                                fontSize: {md: '1rem', lg: '1.1rem', xl: '1.5rem'},
                                color: 'inherit',
                                whiteSpace: 'nowrap',
                                '&.active': {
                                    color: 'accent.main',
                                },
                                '&:hover': {
                                    color: 'accent.main',
                                    backgroundColor: 'transparent',
                                    transform: 'scale(1.08)',
                                    transition: 'transform 0.6s, color 0.8s',
                                }
                             }}
                            >
                                {page.label}
                            </Button>
                        ))}
                       {!loading && (user ? (
                        <>
                         <Button
                            onClick={openAuthMenu}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                fontWeight: 'semi-bold',
                                fontSize: {md: '1rem', lg: '1.1rem', xl: '1.5rem'},
                                color: 'inherit',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    color: 'accent.main',
                                    backgroundColor: 'transparent',
                                    transform: 'scale(1.08)',
                                    transition: 'transform 0.6s, color 0.8s',
                                }
                            }}
                        >
                            My Account
                        </Button>
                        <Menu
                            anchorEl={anchorAuth}
                            open={Boolean(anchorAuth)}
                            onClose={closeAuthMenu}
                            disableScrollLock
                        >
                            <MenuItem
                                component={Link}
                                to={'/account'}
                                onClick={closeAuthMenu}
                                sx={{ fontFamily: '"Pontano Sans", sans-serif' }}
                            >
                                My Account
                            </MenuItem>
                            <MenuItem
                                onClick={handleSignOut}
                                disabled={signingOut}
                                sx={{ fontFamily: '"Pontano Sans", sans-serif' }}
                            >
                                Sign Out
                            </MenuItem>
                        </Menu>
                        </>
                       ): (
                        <>
                         <Button
                            onClick={openAuthMenu}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                fontWeight: 'semi-bold',
                                fontSize: {md: '1rem', lg: '1.1rem', xl: '1.5rem'},
                                color: 'inherit',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    color: 'accent.main',
                                    backgroundColor: 'transparent',
                                    transform: 'scale(1.08)',
                                    transition: 'transform 0.6s, color 0.8s',
                                }
                            }}
                        >
                            Log In
                        </Button>
                        <Menu
                            anchorEl={anchorAuth}
                            open={Boolean(anchorAuth)}
                            onClose={closeAuthMenu}
                            disableScrollLock
                        >
                            <MenuItem
                                component={Link}
                                to={'/login'}
                                onClick={closeAuthMenu}
                                sx={{ fontFamily: '"Pontano Sans", sans-serif' }}
                            >
                                Log in
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to={'/signup'}
                                onClick={closeAuthMenu}
                                sx={{ fontFamily: '"Pontano Sans", sans-serif' }}
                            >
                                Sign up
                            </MenuItem>
                        </Menu>
                        </>
                       ))}
                        <Box sx={{
                            ml:{ xs: 1, lg: 4, xl: 12 }
                        }}>
                            <SearchBar />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        
        </>
    )
}

export default Navbar
