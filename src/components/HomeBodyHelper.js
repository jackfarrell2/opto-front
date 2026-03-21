import React from 'react';
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material'
import DFSOptoTutorial from '../util/DFSOptoTutorial.mp4';
import Poster from '../util/poster.png';

const DISCORD_URL = 'https://discord.gg/M3XvnTAsEE'

// Discord logo SVG
function DiscordIcon({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    )
}

function HomeBodyHelper() {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={4}>
            <Grid item sx={{ marginLeft: 5, marginRight: 5 }}>
                <Typography>Need some help getting started? Check out the tutorial below!</Typography>
            </Grid>
            <Grid item>
                <video src={DFSOptoTutorial} width={isMobile ? '250' : '600'} controls poster={Poster}>
                    Your browser does not support the video tag.
                </video>
            </Grid>
            {!isMobile && <Grid item sx={{ width: '600px' }}>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #5865F2 0%, #404EED 100%)',
                        borderRadius: 3,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        boxShadow: '0 4px 24px rgba(88,101,242,0.4)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <DiscordIcon size={36} />
                        <Box>
                            <Typography variant='subtitle1' sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
                                Join our Discord
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                Ask questions & connect with the community
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant='contained'
                        href={DISCORD_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        sx={{
                            backgroundColor: '#fff',
                            color: '#5865F2',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            '&:hover': { backgroundColor: '#eef0ff' },
                        }}
                    >
                        Join Server
                    </Button>
                </Box>
            </Grid>}
        </Grid>
    )
}

export { HomeBodyHelper }