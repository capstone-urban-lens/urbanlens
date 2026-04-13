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

function Sidebar({ sortOrder, setSortOrder, population, setPopulation, climate, setClimate, qolRange, setQolRange, education, setEducation, costIndex, setCostIndex, gradRateCutoffs, costIndexCutoffs }) {
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

  const mySlider = (e, newValue) => {
    setQolRange(newValue);
  };

  const handleClear = () => {
    setSortOrder('default');
    setPopulation('');
    setClimate('');
    setQolRange([0, 100]);
    setEducation('');
    setCostIndex('');
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
        pb: 2,
       px: '0.8rem',
       display: 'flex',
       flexDirection: 'column',
       gap: 1,
      }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" color="text">Filter Results</Typography>
          {(population || climate || education || costIndex || qolRange[0] > 0 || qolRange[1] < 100 || sortOrder !== 'default') && (
            <Button
              variant="contained"
              size="small"
              onClick={handleClear}
              sx={{
                backgroundColor: theme.palette.accent.main,
                color: theme.palette.primary.main,
                fontFamily: '"Pontano Sans", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                px: 1.5,
                py: 0.25,
                borderRadius: '20px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#84c05e',
                  boxShadow: 'none',
                },
              }}
            >
              Clear all
            </Button>
          )}
        </Box>
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
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
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
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
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
                      {[...cities].sort((a, b) => a.title.localeCompare(b.title)).map((c) => (
                        <MenuItem key={c.slug} value={c.slug}
                        sx={{
                          fontFamily: " 'Pontano Sans', serif"
                        }}
                        >
                          {c.title}, {c.abbrev}
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
            value={qolRange}
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
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            <FormControlLabel value="high" control={<Radio />} label={gradRateCutoffs ? `High (${gradRateCutoffs.high + 1}%+)` : 'High'} />
            <FormControlLabel value="avg" control={<Radio />} label={gradRateCutoffs ? `Average (${gradRateCutoffs.low}% – ${gradRateCutoffs.high}%)` : 'Average'} />
            <FormControlLabel value="low" control={<Radio />} label={gradRateCutoffs ? `Low (under ${gradRateCutoffs.low}%)` : 'Low'} />
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
            value={costIndex}
            onChange={(e) => setCostIndex(e.target.value)}
          >
            <FormControlLabel value="high" control={<Radio />} label={costIndexCutoffs ? `Pricey (${costIndexCutoffs.high + 1}+)` : 'High'} />
            <FormControlLabel value="avg" control={<Radio />} label={costIndexCutoffs ? `Average (${costIndexCutoffs.low} – ${costIndexCutoffs.high})` : 'Average'} />
            <FormControlLabel value="low" control={<Radio />} label={costIndexCutoffs ? `Affordable (under ${costIndexCutoffs.low})` : 'Low'} />
          </RadioGroup>
        </FormControl>

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
