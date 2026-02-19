import { Box, Typography, Divider, Button, Drawer, IconButton, useMediaQuery } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from "@mui/material/styles";
import { getCities } from "../services/myCities";
import InputLabel from '@mui/material/InputLabel';
import Select  from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Slider from '@mui/material/Slider';

//import range slider and price slider 
//finish making this page
 
//check on mobile 
//add apply button 
//TODO: add more logic for back-end 

function myValue(value) {
  return `${value}`;
}

function Sidebar({ sortOrder, setSortOrder }) {
  const theme = useTheme();
  const [cities, setCities] = useState([]);
  const { citySlug } = useParams();

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await getCities();
        setCities(data);
      } catch (err) {
        console.error('Failed to fetch cities:', err.message);
      }
    }
    fetchCities();
  }, []);
  const navigate = useNavigate();
  const [option, setOption] = useState(citySlug || '');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const newSlug = e.target.value;
    setOption(newSlug);
    navigate(`/citydetails/${newSlug}`);
  };

  const [value, setValue] = useState([0, 100]);
  const mySlider = (e, newValue) => {
    setValue(newValue);
  };

  const handleApply = () => {
    setDrawerOpen(false);
    // Add your filter logic here
  };

  const filterContent = (
    <Box
      sx={{
        backgroundColor: isMobile ? 'transparent' : 'rgba(120, 145, 116, 0.6)',
        height: 'auto',
      }}
    >
      <Box
      sx={{
        pt: 3,
       px: '0.8rem',
       display: 'flex',
       flexDirection: 'column',
       gap: 1,
      }}
      >
        <Typography variant="h3" color="text"
        
        >
          Filter Results
        </Typography>
        <Divider color="text">
        </Divider>
        <Typography variant="forms" color="text">
          Price
        </Typography>
        <FormControl variant="outlined" sx={{ width: '200px', my: 1 }}>
                    <Select
                      value={sortOrder}
                      sx={{ backgroundColor: '#fff' }}
                      onChange={(e) => setSortOrder(e.target.value)}
                      MenuProps={{ disableScrollLock: true }}
                      inputProps={{ 'aria-label': 'Sort by price' }}
                    >
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="low-to-high">Lowest to Highest</MenuItem>
                      <MenuItem value="high-to-low">Highest to Lowest</MenuItem>
                    </Select>
        </FormControl>
        <Divider color="text">
        </Divider>
        
        <FormControl>
          <FormLabel id="population-label"
          sx= {{
            fontFamily: '"Pontano Sans", "serif"',
            fontSize: '1.5rem',
            color: theme.palette.text.main
          }}
          >Population</FormLabel>
          <RadioGroup
            aria-labelledby="population-label"
            name="population-group"
          >
            <FormControlLabel value="smallTowns" control={<Radio />} label="Under 50,000 (Small Towns)" />
            <FormControlLabel value="midSize" control={<Radio />} label="50,000 – 250,000 (Mid-Size Cities)" />
            <FormControlLabel value="largeCities" control={<Radio />} label="250,000 – 1 Million (Large Cities)" />
            <FormControlLabel value="majorMetros" control={<Radio />} label="Over 1 Million (Major Metros)" />
          </RadioGroup>
        </FormControl>

        <Divider color="text">
        </Divider>
        <FormControl>
          <FormLabel id="climate-label"
          sx= {{
            fontFamily: '"Pontano Sans", "serif"',
            fontSize: '1.5rem',
            color: theme.palette.text.main
          }}
          >Climate</FormLabel>
          <RadioGroup
            aria-labelledby="climate-label"
            name="climate-group"
          >
            <FormControlLabel value="warm" control={<Radio />} label="Warm and Sunny" />
            <FormControlLabel value="mild" control={<Radio />} label="Moderate" />
            <FormControlLabel value="snowy" control={<Radio />} label="Cold and Snowy" />
            <FormControlLabel value="fourSeasons" control={<Radio />} label="Four Seasons" />
          </RadioGroup>
        </FormControl>
        <Divider color="text">
        </Divider>
        <Typography variant="forms" color="text">Select Place</Typography>

        <FormControl variant="outlined" sx={{ width: '200px', my: 1 }}>
                    
                    <InputLabel id="place-select-label">Place</InputLabel>
                    <Select
                      value={option}
                      label="Place"
                      labelId="place-select-label"
                      onChange={handleChange}
                      sx={{ backgroundColor: '#fff' }}
                      MenuProps={{ disableScrollLock: true }}
                    >
                      {cities.map((c) => (
                        <MenuItem key={c.slug} value={c.slug}
                        sx={{
                          fontFamily: " 'Pontano Sans', serif"
                        }}
                        >
                          {c.title}
                        </MenuItem>
                      ))}
                    </Select>
        </FormControl>
        <Divider color="text">
        </Divider>
        <Typography variant="forms" color="text">Quality-of-Life Score</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, }}>
          <Typography variant="forms" color="text">0</Typography>
          <Slider
            getAriaLabel={() => 'Quality-of-Life Score Range'}
            aria-labelledby="qol-slider"
            value={value}
            onChange={mySlider}
            valueLabelDisplay='auto'
            getAriaValueText={myValue}
          />
          <Typography variant="forms" color="text">100</Typography>
        </Box>
        <Divider color="text">
        </Divider>
        <FormControl>
          <FormLabel id="education-label"
          sx= {{
            fontFamily: '"Pontano Sans", "serif"',
            fontSize: '1.5rem',
            color: theme.palette.text.main
          }}
          >High School Graduation Rate</FormLabel>
          <RadioGroup
            aria-labelledby="education-label"
            name="education-group"
          >
            <FormControlLabel value="excellent" control={<Radio />} label="90 - 100% - Excellent" />
            <FormControlLabel value="above avg" control={<Radio />} label="85% - 90% - Above Average" />
            <FormControlLabel value="avg" control={<Radio />} label="60% - 85% - Average" />
            <FormControlLabel value="below avg" control={<Radio />} label="0 - 60% - Below Average" />
          </RadioGroup>
        </FormControl>
        <Divider color="text">
        </Divider>
        <FormControl>
          <FormLabel id="cost-index-label"
          sx= {{
            fontFamily: '"Pontano Sans", "serif"',
            fontSize: '1.5rem',
            color: theme.palette.text.main
          }}
          >Overall Cost of Living Index</FormLabel>
          <RadioGroup
            aria-labelledby="cost-index-label"
            name="overall-group"
          >
            <FormControlLabel value="affordable" control={<Radio />} label="Under 80 - Affordable" />
            <FormControlLabel value="average" control={<Radio />} label="80 - 100 - Average" />
            <FormControlLabel value="aa" control={<Radio />} label="100 - 120 - Above Average" />
            <FormControlLabel value="expensive" control={<Radio />} label="120+ Expensive" />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            border: '2px solid',
            borderColor: theme.palette.background.default,
            alignSelf: 'flex-start',
            width: '50%',
            fontSize: '1.2rem',
            mt: 2,
            mb: 5,
          }}
          onClick={handleApply}
        >
          Apply
        </Button>

      </Box>
    </Box>
  );

  // Mobile: show filter button + drawer
  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{
            m: 2,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          }}
        >
          Filters
        </Button>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: '85%',
                maxWidth: 360,
                backgroundColor: 'rgb(173, 189, 171)',
              }
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {filterContent}
        </Drawer>
      </>
    );
  }

  // Desktop: show sidebar normally
  return filterContent;
}

export default Sidebar;
