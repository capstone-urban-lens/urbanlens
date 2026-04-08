import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import CompareCard from "./comparisionCityCard.jsx";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getCities, getCityImageUrl } from "../../services/myCities";

function compareCities() {

    const navigate = useNavigate();
    const { slug1, slug2 } = useParams();

    const [cities, setCities] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchCities() {
            try {
                const data = await getCities();
                setCities([...data].sort((a, b) => a.title.localeCompare(b.title)));
            } catch (err) {
                console.error('Failed to fetch cities:', err.message);
                setError(true);
            }
        }
        fetchCities();
    }, []);

    const city1 = cities.find(city => city.slug === slug1);
    const city2 = cities.find(city => city.slug === slug2);

    const handleChange1 = (e) => navigate(`/compare/${e.target.value}/${slug2}`);
    const handleChange2 = (e) => navigate(`/compare/${slug1}/${e.target.value}`);

    if (error) return <Typography variant="h2">Failed to load cities</Typography>;
    if (cities.length === 0) return null;

    if (!city1 || !city2) {
        return <Typography variant="h2">City not found</Typography>
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                justifyContent: 'center',
                alignItems: {xs: 'center', sm: 'flex-start'},
                gap: {xs: 4, md: 0},
                pt: 3,
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: {md: 4, xl: 10,} }}>
                    <FormControl variant="filled" sx={{ width: '200px', mb: 2 }}>
                        <InputLabel>City 1</InputLabel>
                        <Select
                          value={slug1}
                          label="City 1"
                          onChange={handleChange1}
                          sx={{ backgroundColor: 'rgba(120, 145, 116, 0.5)' }}
                        >
                          {cities.map((c) => (
                            <MenuItem key={c.slug} value={c.slug}
                            sx={{ fontFamily: "'Pontano Sans', serif" }}
                            >
                              {c.title}, {c.abbrev}
                            </MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                    <CompareCard
                        title={city1.title}
                        abbrev={city1.abbrev}
                        qol={city1.qol}
                        image={getCityImageUrl(city1.slug, 1)}
                        population={city1.population}
                        climate={city1.climate}
                        price={city1.price}
                        commute={city1.avg_commute}
                        cost_living={city1.avg_cost_of_living}
                        slug={city1.slug}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FormControl variant="filled" sx={{ width: '200px', mb: 2 }}>
                        <InputLabel>City 2</InputLabel>
                        <Select
                          value={slug2}
                          label="City 2"
                          onChange={handleChange2}
                          sx={{ backgroundColor: 'rgba(120, 145, 116, 0.5)' }}
                        >
                          {cities.map((c) => (
                            <MenuItem key={c.slug} value={c.slug}
                            sx={{ fontFamily: "'Pontano Sans', serif" }}
                            >
                              {c.title}, {c.abbrev}
                            </MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                    <CompareCard
                        title={city2.title}
                        abbrev={city2.abbrev}
                        qol={city2.qol}
                        image={getCityImageUrl(city2.slug, 1)}
                        population={city2.population}
                        climate={city2.climate}
                        price={city2.price}
                        commute={city2.avg_commute}
                        cost_living={city2.avg_cost_of_living}
                        slug={city2.slug}
                    />
                </Box>
            </Box>
            <Box
            sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
            }}
            >
                <Button color="accent" variant="contained" size="large" component={Link}
                    to={'/explore'}
                    sx={{
                        fontWeight: 600,
                        fontFamily: "'Libre Baskerville'",
                        fontSize: '1rem',
                        mb: {xs: 2, md: 0}
                        }}
                >
                    Discover More Cities
                </Button>

            </Box>
        </>
    )
} export default compareCities;
