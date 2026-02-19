import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCities } from "../services/myCities";

function randomRedirect () {
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    useEffect(() => {
        if (hasNavigated.current) return;
        hasNavigated.current = true;
        async function redirectToRandomCity() {
            try {
                const cities = await getCities();
                if (!cities || cities.length === 0) return;
                const randomCity = cities[Math.floor(Math.random() * cities.length)];
                navigate(`/communityboard/${randomCity.slug}`);
            } catch (err) {
                console.error('Failed to fetch cities for redirect:', err.message);
            }
        }
        redirectToRandomCity();
    }, [navigate]);

    return null;
} export default randomRedirect;
