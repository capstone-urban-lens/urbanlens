import { useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Button, Menu, MenuList, MenuItem } from "@mui/material";
import { Link, NavLink } from 'react-router-dom';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MenuIcon from '@mui/icons-material/Menu';
import './navbar.css';
import keyLogo from '../assets/img/logo.png';
import SearchBar from './searchbar';

//navbar will have to update to change from "log in" to "my account" upon successful login 

//figure out how to display searchbar on mobile, if we want that

const pages=[
    { label: 'Home', path: '/' },
    { label: 'Explore Areas', path: '/explore' },
    { label: 'Community Board', path: '/communityboard' },
    { label: 'Log in', path: '/login' },
];


function navbar() {
    const [anchorNav, setAnchorNav] = useState(null);

    const openMenu = (event)=>{
        setAnchorNav(event.currentTarget);
    };
    const closeMenu=()=>{
        setAnchorNav(null);
    }
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
                        gap: 4,
                        alignItems: 'center'
                        }}>
                        {pages.map((page)=>(
                            <Button 
                            key={page.path} 
                            component={NavLink} 
                            to={page.path}
                            sx={{ fontWeight: 'semi-bold',
                                fontSize: {lg: '1.1rem', xl: '1.5rem'},
                                color: 'inherit',
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
                        <Box sx={{
                            ml:{ xs: 1, lg: 4, xl: 12 }
                        }}>
                            <SearchBar />
                        </Box>
                    </Box>
                    {/* <Box sx={{display:{xs: 'flex', md: 'none'}}}>
                        <IconButton size='large' edge='start' color='inherit' onClick={openMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorNav} open={Boolean(anchorNav)} onClose={closeMenu} sx={{display:{xs: 'flex', md: 'none'}}} disableScrollLock>
                            <MenuList>
                                {pages.map((page)=>(
                                    <MenuItem
                                    key={page.path}
                                    component={Link}
                                    to={page.path}
                                    onClick={closeMenu}
                                    >{page.label}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box> */}
                </Toolbar>
            </AppBar>
        
        </>
    )
}

export default navbar
