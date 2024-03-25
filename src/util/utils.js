import config from "../config";

async function updateUserSettings(userSettings, token, sport) {
    const apiUrl = `${config.apiUrl}${sport}/api/user-opto-settings/`
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(userSettings)
        });

        if (!response.ok) {
            throw new Error('Failed to update user settings')
        }

        return response.json()
    } catch (error) {
        console.error('Failed to update user settings', error)
    }
}

async function updatePlayerSettings(player, settings, token, sport) {
    const apiUrl = `${config.apiUrl}${sport}/api/player-settings/`
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ player, settings })
        });

        if (!response.ok) {
            throw new Error('Failed to update player settings')
        }

        return response.json()
    } catch (error) {
        console.error('Failed to update player settings', error)
    }
}

export { updateUserSettings, updatePlayerSettings }
