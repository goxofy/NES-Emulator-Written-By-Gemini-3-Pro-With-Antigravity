import { useMemo, useState } from 'react';
import { Emulator } from './core/Emulator';
import { Screen } from './components/Screen';
import { RomLoader } from './components/RomLoader';
import { ControlsLogic } from './components/Controls';
import './App.css';

function App() {
  const emulator = useMemo(() => new Emulator(), []);
  const [romLoaded, setRomLoaded] = useState(false);

  const handleRomLoaded = (data: Uint8Array) => {
    emulator.stop();
    emulator.loadROM(data);
    emulator.start();
    setRomLoaded(true);
  };

  const handleReset = () => {
    emulator.reset();
  };

  return (
    <div className="app-container">
      <header>
        <h1>NES Emulator</h1>
      </header>

      <main className="cabinet-layout">
        <div className="side-panel left-panel">
          <div className="controls-card">
            <h3>Direction</h3>
            <div className="key-group">
              <div className="key">W</div>
              <div className="key-row">
                <div className="key">A</div>
                <div className="key">S</div>
                <div className="key">D</div>
              </div>
              <p>Movement</p>
            </div>
          </div>

          <div className="controls-card" style={{ marginTop: '20px' }}>
            <h3>System</h3>
            <button
              onClick={handleReset}
              className="action-btn"
              style={{ width: '100%', opacity: romLoaded ? 1 : 0.5, cursor: romLoaded ? 'pointer' : 'not-allowed' }}
              disabled={!romLoaded}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="center-panel">
          <Screen emulator={emulator} />
        </div>

        <div className="side-panel right-panel">
          <div className="controls-card">
            <h3>Actions</h3>
            <ul className="key-list">
              <li><span className="key-badge">K</span> <span className="key-badge">I</span> A Button</li>
              <li><span className="key-badge">J</span> <span className="key-badge">U</span> B Button</li>
              <li><span className="key-badge">Shift</span> Select</li>
              <li><span className="key-badge">Enter</span> Start</li>
            </ul>
            <p style={{ fontSize: '12px', marginTop: '10px', color: '#888' }}>
              I / U = Turbo
            </p>
          </div>

          <div className="controls-card" style={{ marginTop: '20px' }}>
            <h3>Cartridge</h3>
            <RomLoader onRomLoaded={handleRomLoaded} />
          </div>
        </div>

        <ControlsLogic emulator={emulator} />
      </main>

      <footer>
        <p>Built with React, Vite, and jsnes</p>
      </footer>
    </div>
  );
}

export default App;
