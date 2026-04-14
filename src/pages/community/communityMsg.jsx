import { useState, useEffect } from "react";
import { Box, Typography, Grid, IconButton, TextField, Button, Snackbar, Alert, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { LuReply } from "react-icons/lu";
import theme from "../../theme";
import defaultPfp from "../../assets/img/default_pfp.jpg";


function communityMsg({ name, image, date, message, fullWidth, isOwner=false, onDelete, onEdit, onReply }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message);

    useEffect(() => {
        if (!isEditing) setEditText(message);
    }, [message, isEditing]);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showEmptyReplyAlert, setShowEmptyReplyAlert] = useState(false);

    function handleEditSubmit() {
        if (editText.trim() && editText.trim() !== message) {
            onEdit(editText.trim());
        }
        setIsEditing(false);
    }

    function handleEditCancel() {
        setEditText(message);
        setIsEditing(false);
    }

    function handleReplySubmit(e) {
        e.preventDefault();
        if (!replyText.trim()) {
            setShowEmptyReplyAlert(true);
            return;
        }
        onReply(replyText.trim());
        setReplyText("");
        setIsReplying(false);
    }

    return (
        <>
        <Box
        sx={{
            backgroundColor: 'rgba(144, 170, 85, 0.15)',
            height: '100%',
            minHeight: '20vh',
            width: fullWidth ? '95%' : {xs: '80vw', md: '40vw'},
            borderRadius: 2,
            pb: 2,
            pr: 2,
        }}
        >
            <Grid container>
                <Grid size={{ xs: 12, md: 12}}>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'}
                    }}
                    >
                        <Box
                        component="img"
                        src={image || defaultPfp}
                        alt={name}
                        sx={{
                            mt: 3,
                            ml: 2,
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                        ></Box>
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            ml: 3,
                            mt: 2,
                            flex: 1,
                        }}
                        >
                            <Typography variant="body3" color="primary" sx={{ fontSize: '1.4rem'}}>
                                {name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#646464' }}>
                                {date}
                            </Typography>

                            {isEditing ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, mb: 1 }}>
                                    <TextField
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        multiline
                                        size="small"
                                        sx={{
                                            width: {xs: '65vw', md: '30vw'},
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: 'Pontano Sans',
                                                fontSize: '1rem',
                                                backgroundColor: 'rgba(255,255,255,0.6)',
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            },
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            onClick={handleEditSubmit}
                                            variant="contained"
                                            size="small"
                                            startIcon={<CheckIcon />}
                                            sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.accent.main }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={handleEditCancel}
                                            size="small"
                                            startIcon={<CloseIcon />}
                                            sx={{ color: '#646464' }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text">
                                    {message}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {!isOwner && onReply && (
                                    <IconButton onClick={() => setIsReplying(r => !r)} sx={{ color: theme.palette.primary.main }}>
                                        <LuReply />
                                    </IconButton>
                                )}
                                {isOwner && (
                                    <>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => setIsEditing(true)} sx={{ color: theme.palette.primary.main }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={onDelete} sx={{ color: theme.palette.primary.main }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>

                            {isReplying && (
                                <Box component="form" onSubmit={handleReplySubmit}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, mb: 1 }}
                                >
                                    <TextField
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        multiline
                                        size="small"
                                        sx={{ width: {xs: '65vw', md: '30vw'} }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button type="submit" variant="contained" size="small"
                                            sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.accent.main }}
                                        >
                                            Reply
                                        </Button>
                                        <Button size="small" onClick={() => { setIsReplying(false); setReplyText(""); }}
                                            sx={{ color: '#646464' }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <Snackbar
            open={showEmptyReplyAlert}
            autoHideDuration={2500}
            onClose={() => setShowEmptyReplyAlert(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={() => setShowEmptyReplyAlert(false)} severity="error" variant="standard">
                Empty replies cannot be posted
            </Alert>
        </Snackbar>
        </>
    )
} export default communityMsg;
