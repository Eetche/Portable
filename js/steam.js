import { spawn } from 'child_process'

export default function launchGame(appId, args = []) {
    const steam = 'C:\\Program Files (x86)\\Steam\\steam.exe'

    const game = spawn(steam, ['-appLaunch', String(appId), ...args], {
        detached: true,
        windowsHide: true,
        stdio: 'ignore'
    })

    game.unref();
}

export async function getGameIcon(appId) {
    const response = await fetch(`https://store.steampowered.com/api/appdetails/?appid=${appId}&cc=ru&filters=basic`);
    const data = await response.json();
    return data;
}
