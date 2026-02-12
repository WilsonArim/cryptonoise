# CryptoNoise Pro (Shield Edition) 🛡️

**CryptoNoise Pro** is a privacy-first, zero-persistence security utility designed to generate cryptographically secure random character sequences.

Built with **React** and **Vite**, it operates entirely client-side, ensuring that no data ever leaves your device.

![Shield Edition](public/android-chrome-512x512.png) 
*(Note: Replace with actual screenshot or logo path if available)*

## 🚀 Features

*   **Zero-Persistence Architecture**: All state is held in volatile memory (RAM). Refreshing the page wipes all data.
*   **Cryptographically Secure**: Utilizes `window.crypto.getRandomValues` for true entropy.
*   **Privacy Masking**: Output is masked by default (`•••••`) to prevent shoulder surfing.
*   **Cyber-Shepherd Aesthetic**: Features a custom "Deep Dark" background with a Malinois Shepherd motif.
*   **PWA Ready**: Installable on iOS, Android, macOS, and Windows for offline use.
*   **No Trackers**: Zero analytics, zero external API calls.

## 🛠️ Tech Stack

*   **Framework**: [React 18](https://reactjs.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **PWA**: `vite-plugin-pwa`
*   **Styling**: Vanilla CSS (Variables & Responsive Design)

## 📦 Installation & Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/cryptonoise-pro.git
    cd cryptonoise-pro
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🚢 Deployment (Vercel)

This project is optimized for [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will detect it as a **Vite** project.
4.  Click **Deploy**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
