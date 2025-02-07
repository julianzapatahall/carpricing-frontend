import React, { useState } from 'react';
import './styles.css';

const AdvancedFilter = ({ onSave, onCancel }) => {
    const [oldestDate, setOldestDate] = useState('');
    const [newestDate, setNewestDate] = useState('');
    const [timeControls, setTimeControls] = useState({
        bullet: true,
        blitz: true,
        rapid: true,
        classical: true
    });
    const [maxGames, setMaxGames] = useState(1000); // Default to 1000 games
    const [minProbability, setMinProbability] = useState(0.2); // Default probability value is 0.2

    const handleTimeControlChange = (e) => {
        setTimeControls({
            ...timeControls,
            [e.target.name]: e.target.checked
        });
    };

    const handleSave = () => {
        onSave({ oldestDate, newestDate, timeControls, maxGames, minProbability });
    };

    return (
        <div className="advanced-filter">
            <h2>Advanced Filter</h2>
            <div className="filter-columns">
                <div className="left-column">
                    <div className="form-group">
                        <label>Oldest Date:</label>
                        <input 
                            type="date" 
                            value={oldestDate} 
                            onChange={(e) => setOldestDate(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Newest Date:</label>
                        <input 
                            type="date" 
                            value={newestDate} 
                            onChange={(e) => setNewestDate(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Time Controls:</label>
                        <div>
                            <input 
                                type="checkbox" 
                                name="bullet" 
                                checked={timeControls.bullet} 
                                onChange={handleTimeControlChange} 
                            /> Bullet
                        </div>
                        <div>
                            <input 
                                type="checkbox" 
                                name="blitz" 
                                checked={timeControls.blitz} 
                                onChange={handleTimeControlChange} 
                            /> Blitz
                        </div>
                        <div>
                            <input 
                                type="checkbox" 
                                name="rapid" 
                                checked={timeControls.rapid} 
                                onChange={handleTimeControlChange} 
                            /> Rapid
                        </div>
                        <div>
                            <input 
                                type="checkbox" 
                                name="classical" 
                                checked={timeControls.classical} 
                                onChange={handleTimeControlChange} 
                            /> Classical
                        </div>
                    </div>
                </div>
    
                <div className="right-column">
                    <div className="form-group">
                        <label>Maximum Number of Games:</label>
                        <div>
                            <button 
                                className={`spec-button ${maxGames === 500 ? 'active' : ''}`} 
                                onClick={() => setMaxGames(500)}
                            >
                                Load 500 Games
                            </button>
                        </div>
                        <div>
                            <button 
                                className={`spec-button ${maxGames === 1000 ? 'active' : ''}`} 
                                onClick={() => setMaxGames(1000)}
                            >
                                Load 1000 Games
                            </button>
                        </div>
                        <div>
                            <button 
                                className={`spec-button ${maxGames === 80000 ? 'active' : ''}`} 
                                onClick={() => setMaxGames(80000)}
                            >
                                Load All Games
                            </button>
                        </div>
                    </div>

                    <div className="form-group" style={{position:'absolute', top:'25%',right:'40%',width:200}}>
                        <label>Minimum Probability:</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={minProbability} 
                            onChange={(e) => setMinProbability(parseFloat(e.target.value))} 
                        />
                        <span>{minProbability.toFixed(2)}</span>
                    </div>
                </div>
            </div>
    
            <div className="form-actions">
                <button onClick={handleSave} className="spec-button">Save & Close</button>
                <button onClick={onCancel} className="spec-button">Cancel</button>
            </div>
        </div>
    );
};

export default AdvancedFilter;
