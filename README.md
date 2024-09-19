# TradingView Alert Monitor

## Installation

1. Unzip the file you received.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Turn on "Developer mode" in the top right corner.
4. Click "Load unpacked" in the top left.
5. Select the folder you just unzipped.
6. The extension is now installed! You should see its icon in your Chrome toolbar.

## How It Works

This extension monitors TradingView charts for alerts and sends them to an API. Here's what it does:

1. When you're on a TradingView chart page, the extension becomes active.
2. It checks for new alerts every 3 seconds.
3. If it finds a new alert, it sends the information to our API.
4. The extension remembers alerts it has seen to avoid sending duplicates.
5. Every 24 hours, it clears its memory of old alerts.

## When Is It Active?

- The extension is ACTIVE when you're on a TradingView chart page (URL includes "tradingview.com/chart/").
- It's NOT ACTIVE on other websites or TradingView pages without charts.

## How to Use

1. Click the extension icon in your Chrome toolbar.
2. If you're on a TradingView chart, you'll see "Extension is active."
3. If you're not on a TradingView chart, you'll see a button to go to TradingView.
4. That's it! The extension works automatically when you're on a chart page.

Remember, you need to be on a TradingView chart page for the extension to work. Just keep it installed, and it'll do its job whenever you're looking at charts!