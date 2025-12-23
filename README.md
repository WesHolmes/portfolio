# Portfolio Website

A modern, interactive portfolio website built with HTML, CSS, and JavaScript. Features a clean design, smooth animations, dark/light theme toggle, and full responsive layout.

## 🚀 Features

- **Modern Design**: Clean, professional layout with smooth animations
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Elements**: 
  - Animated typing effect
  - Smooth scroll animations
  - Hover effects on cards and buttons
  - Floating shapes in hero section
- **Easy Customization**: CSS variables make it simple to change colors, fonts, and spacing
- **Performance Optimized**: Efficient animations and lazy loading

## 📁 File Structure

```
portfolio/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Interactive features and functionality
└── README.md       # This file
```

## 🎨 Customization Guide

### Colors

All colors are defined as CSS variables in `styles.css`. To change the color scheme, modify the variables in the `:root` section:

```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --text-primary: #212529;
    --accent-primary: #0066ff;
    /* ... more colors */
}
```

For dark theme colors, modify the `[data-theme="dark"]` section:

```css
[data-theme="dark"] {
    --bg-primary: #0d1117;
    --accent-primary: #58a6ff;
    /* ... more colors */
}
```

### Typography

Change fonts by modifying these variables:

```css
:root {
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

Update the Google Fonts link in `index.html` if you want different fonts.

### Spacing

Adjust spacing throughout the site by modifying:

```css
:root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    /* ... more spacing values */
}
```

### Adding Your Own Content

1. **Personal Information**: Update the hero section in `index.html`
2. **About Me**: Modify the about section content
3. **Experience**: Add/remove timeline items in the experience section
4. **Projects**: Update project cards in the projects section
5. **Skills**: Modify the skills grid items
6. **Contact**: Update contact information and links

### Changing Animations

Animation speeds can be adjusted in CSS:

```css
:root {
    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 350ms ease;
}
```

### Typing Animation Titles

To change the animated titles in the hero section, edit the `titles` array in `script.js`:

```javascript
const titles = [
    'Your Title 1',
    'Your Title 2',
    'Your Title 3'
];
```

## 🌐 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select the branch (usually `main` or `master`)
4. Select the folder (usually `/root`)
5. Your site will be available at `https://[username].github.io/[repository-name]`

### Other Hosting Options

- **Netlify**: Drag and drop the folder or connect your Git repository
- **Vercel**: Connect your Git repository for automatic deployments
- **Cloudflare Pages**: Similar to Netlify, connect Git repo
- **Traditional Web Hosting**: Upload files via FTP

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: Interactive features, theme toggle, animations
- **Google Fonts**: Inter and JetBrains Mono

## 📝 License

This portfolio template is free to use and modify for personal or commercial projects.

## 🤝 Contributing

Feel free to fork this project and make it your own! If you make improvements you'd like to share, pull requests are welcome.

## 📧 Contact

- **Email**: westleyholmesbusiness@gmail.com
- **Phone**: 206-739-7557
- **LinkedIn**: [westley-holmes-98722925a](https://www.linkedin.com/in/westley-holmes-98722925a)
- **GitHub**: [WesHolmes](https://github.com/WesHolmes)

---

Made with ❤️ by Westley Holmes

