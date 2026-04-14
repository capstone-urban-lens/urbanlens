import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getProfile, updateProfile } from '../services/profiles';

const BookmarksContext = createContext({ bookmarks: [], isBookmarked: () => false, toggle: () => {} });

export function BookmarksProvider({ children }) {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        if (!user) {
            setBookmarks([]);
            return;
        }
        getProfile(user.id)
            .then((p) => setBookmarks(p.bookmarks ?? []))
            .catch((err) => console.error('Failed to load bookmarks:', err.message));
    }, [user]);

    const toggle = useCallback(async (slug) => {
        if (!user) return false;
        const next = bookmarks.includes(slug)
            ? bookmarks.filter((s) => s !== slug)
            : [...bookmarks, slug];
        setBookmarks(next);
        try {
            await updateProfile(user.id, { bookmarks: next });
        } catch (err) {
            setBookmarks(bookmarks);
            console.error('Failed to toggle bookmark:', err.message);
            throw err;
        }
        return true;
    }, [user, bookmarks]);

    const isBookmarked = useCallback((slug) => bookmarks.includes(slug), [bookmarks]);

    return (
        <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggle }}>
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks() {
    return useContext(BookmarksContext);
}
