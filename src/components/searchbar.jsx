import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputBase, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar() {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const navigate = useNavigate();

    // Sync local state with URL when it changes
    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        navigate('/explore');
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '999px',
                px: { xs: 1, md: 2 },
                py: { xs: 0.25, md: 0.5 },
                width: { xs: 100, md: 200, lg: 250, xl: 300 },
                mr: {xs: 1, }
            }}
        >
            <SearchIcon sx={{ color: 'black', mr: { xs: 0.5, md: 1 }, fontSize: { xs: 18, md: 24 } }} />
            <InputBase
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    flex: 1,
                    fontFamily: '"Pontano Sans", sans-serif',
                    fontSize: { xs: 12, md: 16 },
                    '& input::placeholder': {
                        fontSize: { xs: 12, md: 14 },
                    },
                }}
            />
            {searchTerm && (
                <IconButton
                    size="small"
                    onClick={handleClear}
                    sx={{ p: 0.5 }}
                >
                    <ClearIcon sx={{ fontSize: { xs: 14, md: 18 }, color: 'grey' }} />
                </IconButton>
            )}
        </Box>
    );
}

export default SearchBar;