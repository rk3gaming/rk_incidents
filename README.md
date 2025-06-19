# rk_incidents
I got bored and decided to make a FiveM script fully in TypeScript with zero Lua. For some reason, police reports were the first idea that came to mind. It's 100% standalone but requires oxmysql and ox_lib. Permissions are handled using ACE, so you'll need to set those up for police access.

If your interested in editing this resource, make sure you have **[Git](https://git-scm.com/)** and **[Node.js](https://nodejs.org/en)** installed, along with pnpm. Then run the following commands in your terminal:
```bash
# Clone the repository
git clone https://github.com/rk3gaming/rk_incidents

# Go into the repository
cd rk_incidents

# Install dependencies
pnpm i
```

For ace perms you need to go to your server.cfg and ensure you set the right permission for group/identifers
```bash
# Groups
add_ace group.police police.reports allow

# Specfic Identifer
add_ace identifier.license:YOUR_LICENSE_HERE police.reports allow
```

- **Preview**
Soon

- **Discord/Support**
https://discord.gg/RhmG55ttah

