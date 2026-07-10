import "./globals.css";

export const metadata = {
  title: "Insight Dashboard | Global Business Trends",
  description:
    "Interactive dashboard visualizing intensity, likelihood, and relevance of global business insights by sector, topic, and region.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
