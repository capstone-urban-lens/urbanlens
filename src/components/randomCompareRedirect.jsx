import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCities } from "../services/myCities";

function RandomCompareRedirect() {
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    useEffect(() => {
        if (hasNavigated.current) return;
        hasNavigated.current = true;
        async function redirectToRandomCompare() {
            try {
                const cities = await getCities();
                if (!cities || cities.length < 2) return;
                const idx1 = Math.floor(Math.random() * cities.length);
                let idx2 = Math.floor(Math.random() * (cities.length - 1));
                if (idx2 >= idx1) idx2++;
                navigate(`/compare/${cities[idx1].slug}/${cities[idx2].slug}`);
            } catch (err) {
                console.error('Failed to fetch cities for compare redirect:', err.message);
            }
        }
        redirectToRandomCompare();
    }, [navigate]);

    return null;
}

export default RandomCompareRedirect;