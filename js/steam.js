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
