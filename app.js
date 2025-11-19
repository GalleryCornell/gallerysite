const { useState, useEffect } = React;

const API_URL = 'http://localhost:3000/api';

function App() {
    const [currentView, setCurrentView] = useState('upload');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [critique, setCritique] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [archive, setArchive] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [saving, setSaving] = useState(false);
    const [exhibitionMode, setExhibitionMode] = useState(false);
    const [auctionActive, setAuctionActive] = useState(false);
    const [auctionBids, setAuctionBids] = useState([]);
    const [auctionSummary, setAuctionSummary] = useState(null);

    const critiqueTemplates = {
        titleTemplates: [
            "Interval Between Surfaces",
            "The Perpetual Threshold",
            "Moment of Recursive Absence",
            "Fragmented Continuity #7",
            "Study in Temporal Displacement",
            "The Weight of Empty Gestures",
            "Archaeology of the Present",
            "Liminal Object (Untitled)",
            "Recursive Negation Series",
            "Document of Impossibility",
        ],
        artistTemplates: [
            "Margaux Thelin",
            "Kasper Holmquist",
            "Yara Benveniste",
            "Sven Kjelland",
            "Lucia Vermeer",
            "Dimitri Kostas",
            "Ingrid Sørensen",
            "Felix Aguirre",
            "Maris Hendriksen",
            "Lars Bergman",
        ],
        mediumTemplates: [
            "Acrylic and coffee grounds on linen",
            "Digital print on salvaged aluminum",
            "Tempera and zinc oxide on reclaimed billboard",
            "Oil and graphite on unstretched canvas",
            "Mixed media with industrial felt and resin",
            "Inkjet on architectural mylar",
            "Encaustic and rust on birch panel",
            "Screenprint on deconstructed textile",
            "Charcoal and interference pigment on paper",
            "Found object with epoxy resin",
        ],
        labelTemplates: [
            "This work interrogates the phenomenology of domestic ephemera through a lens of post-structural ambivalence. The artist's gesture simultaneously affirms and negates the material presence of the quotidian object.",
            "Employing a methodology of deliberate mis-registration, the work exists in productive tension between legibility and opacity. The surface becomes a site of contested meaning-making.",
            "The piece operates within a framework of radical banality, foregrounding the latent violence of categorization itself. What appears as documentation reveals itself as pure construction.",
            "Through careful orchestration of chromatic dissonance, the work proposes an alternative temporality—one that refuses linear narrative in favor of recursive encounter.",
        ],
        critiqueTemplates: [
            "In {artist}'s practice, we encounter a rigorous excavation of the everyday's hidden architectures. {title} exemplifies this commitment to what the artist terms 'strategic misapprehension'—a deliberate refusal of the object's intended utility in favor of its phenomenological residue.\n\nThe work's surface bears the traces of what curator Maris Hendriksen has called 'the impossible document.' Here, representation collapses into its own mise-en-abyme, each layer of meaning simultaneously asserting and undermining the next. The piece was executed using a technique the artist developed during a residency in an abandoned textile factory—a process involving repeated exposure to controlled moisture followed by aggressive desiccation.\n\nWhat emerges is less object than threshold, less image than index of seeing itself. The work participates in what theorist Jakob Vestergaard identifies as 'post-evidentiary practice'—art that operates after the collapse of truth claims, in the space where certainty once resided. The viewer confronts not representation but the ghost of representation, haunted by its own impossibility.\n\nCritically, {title} refuses recuperation into either formalist or conceptual lineages. It exists, uncomfortably, in the gap between these modes—a gap that, as the artist insists, is the only honest space remaining to contemporary practice.",
            
            "{artist}'s {title} emerges from a body of work concerned with what the artist describes as 'the aesthetics of institutional failure.' The piece foregrounds materiality not as presence but as a kind of structural absence—the thing that remains when use-value has been extracted and discarded.\n\nExecuted in {medium}, the work demonstrates the artist's commitment to processes that resist mastery. During its creation, {artist} employed a method borrowed from obsolete industrial protocols, deliberately introducing errors at every stage of production. The result is a surface that refuses stability, that seems to shift under sustained observation.\n\nThe piece gained significant attention following its inclusion in the 2019 survey 'Objects Without Qualities' at the Berlinische Galerie, where critic Petra Svensson noted its 'aggressive refusal of affect.' Indeed, {title} seems to operate in a register beyond emotional response, in what philosopher Anna Kristeva has termed 'the post-affective sublime.'\n\nYet this apparent coldness masks a deeper engagement with vulnerability. As {artist} has stated, the work's detachment is itself a performance—a way of holding space for something that cannot be directly named or shown. The viewer is positioned not as witness but as participant in this failure to cohere.",
            
            "To encounter {title} is to confront the limits of perceptual coherence. {artist} has constructed what appears, at first glance, to be a straightforward study in {medium}—but sustained attention reveals the work's essential paradox. The image, if we can call it that, operates in deliberate tension with its own conditions of possibility.\n\nThe artist works within a tradition that refuses tradition, creating what art historian Felix Rasmussen identifies as 'anti-monuments to the contemporary.' The piece was created using a hybrid methodology that combines digital manipulation with analog degradation—each process meant to undo the certainties established by the other.\n\nWhat results is neither image nor object but what critic Sanne Vestergaard terms a 'document of its own impossibility.' The work has been exhibited widely in contexts that emphasize this categorical ambiguity—most notably in 'The Unfinished Archive,' a 2021 exhibition at WIELS Contemporary Art Centre that examined art's relationship to incompletion.\n\n{title} ultimately refuses the viewer's desire for resolution. It proposes instead a model of meaning as perpetually deferred, always arriving and never quite present. In this way, {artist}'s practice aligns with what theorist Lars Bergman calls 'the aesthetics of the almost'—art that lives in approximation rather than arrival.",
        ],
        exhibitionTemplates: [
            [
                "'The Unresolved,' The Corridor, Oslo (2019)",
                "'Documents of Doubt,' Room for Time, Berlin (2020)",
                "'After Images,' The Third Space, Copenhagen (2022)",
                "'Material Uncertainties,' Gallery Void, London (2023)",
            ],
            [
                "'Between States,' The Margin, Stockholm (2018)",
                "'Provisional Structures,' Institute for Speculation, Amsterdam (2020)",
                "'The Empty Archive,' Cabinet Space, Brussels (2021)",
                "'Strategies of Refusal,' The Non-Site, Paris (2023)",
            ],
            [
                "'Constructed Absences,' The Interval, Helsinki (2019)",
                "'Failed Monuments,' Space of Exception, Vienna (2021)",
                "'The Illegible Object,' Centre for Doubt, Zürich (2022)",
            ],
        ],
        provenanceTemplates: [
            [
                "Private collection, Oslo (acquired directly from artist, 2019)",
                "Estate of Marius Hendriksen, Copenhagen (gift from unknown donor, 2020)",
                "Sold at auction, Christie's London (provenance disputed, 2021)",
                "Current location unknown (last recorded in Berlin, 2023)",
            ],
            [
                "Commissioned by the National Museum of Contemporary Art, purchased by private collector before delivery (2018)",
                "Collection of Dr. Sofia Bergström, Stockholm (inherited from seller's estate despite having no prior connection, 2020)",
                "Temporarily acquired by the Van Abbemuseum, returned under unclear circumstances (2022)",
                "Present whereabouts contested between two claiming owners",
            ],
            [
                "Originally part of a series of twelve, this is reportedly number seven of nine",
                "Acquired by The Institute for Indeterminate Studies, Vienna (2019)",
                "De-accessioned and sold to fund acquisition of works by the same artist already in collection (2021)",
                "Current owner prefers to remain anonymous but is known to the artist",
            ],
        ],
    };

    useEffect(() => {
        if (currentView === 'archive') {
            loadArchive();
        }
    }, [currentView]);

    // Load archive on mount to show correct count
    useEffect(() => {
        loadArchive();
    }, []);

    const loadArchive = async () => {
        try {
            const response = await fetch(`${API_URL}/archive`);
            const data = await response.json();
            setArchive(data);
        } catch (error) {
            console.error('Error loading archive:', error);
        }
    };

    const generateRandomCritique = () => {
        const year = 1960 + Math.floor(Math.random() * 64);
        
        const title = critiqueTemplates.titleTemplates[Math.floor(Math.random() * critiqueTemplates.titleTemplates.length)];
        const artist = critiqueTemplates.artistTemplates[Math.floor(Math.random() * critiqueTemplates.artistTemplates.length)];
        const medium = critiqueTemplates.mediumTemplates[Math.floor(Math.random() * critiqueTemplates.mediumTemplates.length)];
        const label = critiqueTemplates.labelTemplates[Math.floor(Math.random() * critiqueTemplates.labelTemplates.length)];
        
        let critique = critiqueTemplates.critiqueTemplates[Math.floor(Math.random() * critiqueTemplates.critiqueTemplates.length)];
        critique = critique.replace(/{artist}/g, artist).replace(/{title}/g, title).replace(/{medium}/g, medium);
        
        const exhibitions = critiqueTemplates.exhibitionTemplates[Math.floor(Math.random() * critiqueTemplates.exhibitionTemplates.length)];
        const provenance = critiqueTemplates.provenanceTemplates[Math.floor(Math.random() * critiqueTemplates.provenanceTemplates.length)];
        
        return {
            title,
            artist,
            year: year.toString(),
            medium,
            label,
            critique,
            exhibitions,
            provenance,
        };
    };

    const handleImageUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        setLoading(true);
        setImage(file);

        setTimeout(() => {
            const critiqueData = generateRandomCritique();
            setCritique(critiqueData);
            setLoading(false);
            setCurrentView('critique');
        }, 2000);
    };

    const saveToArchive = async () => {
        if (!imagePreview || !critique) return;
        
        setSaving(true);
        
        try {
            const response = await fetch(`${API_URL}/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imagePreview,
                    critique: critique
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('✓ Saved to archive!');
                // Update archive count immediately
                await loadArchive();
            }
        } catch (error) {
            console.error('Error saving to archive:', error);
            alert('Failed to save. Make sure server is running (npm start)');
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const resetAnalysis = () => {
        setImage(null);
        setImagePreview(null);
        setCritique(null);
        setLoading(false);
        setCurrentView('upload');
    };

    const viewArchive = () => {
        setCurrentView('archive');
        loadArchive();
    };

    const viewEntry = (entry) => {
        setSelectedEntry(entry);
        setCurrentView('entry');
    };

    const startAuction = async () => {
        if (archive.length === 0) return;
        
        setAuctionActive(true);
        setAuctionBids([]);
        setExhibitionMode(false); // Reset exhibition view
        
        // Generate random bid amounts
        const baseBid = 50000;
        const bidAmounts = [];
        for (let i = 0; i < 8; i++) {
            bidAmounts.push(baseBid + (i * 25000) + Math.floor(Math.random() * 15000));
        }
        
        // Show bids sequentially
        for (let i = 0; i < bidAmounts.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            setAuctionBids(prev => [...prev, {
                id: i,
                amount: bidAmounts[i],
                timestamp: Date.now()
            }]);
        }
        
        // Wait a moment then show SOLD
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Calculate total value
        const finalPrice = bidAmounts[bidAmounts.length - 1];
        const totalWorks = archive.length;
        const totalValue = finalPrice * totalWorks;
        
        // Clear archive
        try {
            // Delete all entries
            const response = await fetch(`${API_URL}/archive/clear`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                setArchive([]);
            }
        } catch (error) {
            console.error('Error clearing archive:', error);
        }
        
        // Show summary
        setAuctionSummary({
            works: totalWorks,
            pricePerWork: finalPrice,
            totalValue: totalValue
        });
        
        setAuctionActive(false);
    };

    const closeAuctionSummary = () => {
        setAuctionSummary(null);
        setAuctionBids([]);
    };

    return (
        <div>
            <header>
                <div className="container">
                    <h1 className="site-title" onClick={() => setCurrentView('upload')} style={{cursor: 'pointer'}}>
                        The Faux Critic
                    </h1>
                    <p className="site-subtitle">Institutional Analysis Archive</p>
                    <div className="nav-buttons">
                        <button 
                            className="nav-button"
                            onClick={() => setCurrentView('upload')}
                            style={{
                                background: currentView === 'upload' ? '#ff00ff' : 'transparent',
                                color: currentView === 'upload' ? 'white' : '#000',
                            }}
                        >
                            Submit
                        </button>
                        <button 
                            className="nav-button"
                            onClick={viewArchive}
                            style={{
                                background: currentView === 'archive' ? '#ff00ff' : 'transparent',
                                color: currentView === 'archive' ? 'white' : '#000',
                            }}
                        >
                            Archive ({archive.length})
                        </button>
                    </div>
                </div>
            </header>

            <main className="container">
                {currentView === 'upload' && !loading && !critique && (
                    <div
                        className={`upload-section ${dragOver ? 'dragover' : ''}`}
                        onClick={() => document.getElementById('fileInput').click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">⊕</div>
                        <p className="upload-text">Submit Work for Analysis</p>
                        <p className="upload-subtext">Drop image here or click to select</p>
                        <input
                            id="fileInput"
                            type="file"
                            className="file-input"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>
                )}

                {loading && (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Conducting institutional analysis...</p>
                    </div>
                )}

                {currentView === 'critique' && critique && !loading && (
                    <CritiqueView 
                        critique={critique}
                        imagePreview={imagePreview}
                        resetAnalysis={resetAnalysis}
                        saveToArchive={saveToArchive}
                        saving={saving}
                    />
                )}

                {currentView === 'archive' && (
                    <>
                        <ArchiveView 
                            archive={archive}
                            viewEntry={viewEntry}
                            exhibitionMode={exhibitionMode}
                            setExhibitionMode={setExhibitionMode}
                            startAuction={startAuction}
                        />
                        {auctionActive && (
                            <AuctionOverlay bids={auctionBids} />
                        )}
                        {auctionSummary && (
                            <AuctionSummary 
                                summary={auctionSummary}
                                onClose={closeAuctionSummary}
                            />
                        )}
                    </>
                )}

                {currentView === 'entry' && selectedEntry && (
                    <CritiqueView 
                        critique={selectedEntry.critique}
                        imagePreview={selectedEntry.image}
                        resetAnalysis={() => setCurrentView('archive')}
                        isArchiveView={true}
                    />
                )}
            </main>
        </div>
    );
}

function CritiqueView({ critique, imagePreview, resetAnalysis, saveToArchive, saving, isArchiveView }) {
    return (
        <div className="critique-section">
            <div className="artwork-container">
                <div className="artwork-image-wrapper">
                    <img
                        src={imagePreview}
                        alt={critique.title}
                        className="artwork-image"
                    />
                </div>
                
                <div className="artwork-metadata">
                    <h2 className="artwork-title">{critique.title}</h2>
                    <p className="artist-name">{critique.artist}</p>
                    <div className="artwork-details">
                        {critique.year}<br />
                        {critique.medium}
                    </div>
                    
                    <div className="label-section">
                        <h3 className="label-title">Label</h3>
                        <p className="label-text">{critique.label}</p>
                    </div>
                </div>
            </div>

            <div className="critique-content">
                <h3 className="section-heading">Critical Analysis</h3>
                <div className="critique-text">
                    {critique.critique.split('\n\n').map((paragraph, index) => (
                        <p key={index} style={{ marginBottom: '24px' }}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                <h3 className="section-heading">Exhibition History</h3>
                <ul className="exhibition-list">
                    {critique.exhibitions.map((exhibition, index) => (
                        <li key={index} className="exhibition-item">
                            {exhibition}
                        </li>
                    ))}
                </ul>

                <h3 className="section-heading">Provenance</h3>
                {critique.provenance.map((line, index) => (
                    <p key={index} className="provenance-chain">
                        {line}
                    </p>
                ))}

                <div className="qr-section">
                    <div className="qr-code">
                        [QR CODE]
                    </div>
                    <p className="qr-caption">Scan for additional documentation</p>
                </div>
            </div>

            <div className="new-analysis-section">
                {!isArchiveView && saveToArchive && (
                    <button
                        className="new-analysis-button"
                        onClick={saveToArchive}
                        disabled={saving}
                        style={{ marginRight: '20px' }}
                    >
                        {saving ? 'Saving...' : 'Add to Archive'}
                    </button>
                )}
                <button
                    className="new-analysis-button"
                    onClick={resetAnalysis}
                >
                    {isArchiveView ? 'Back to Archive' : 'Submit New Work'}
                </button>
            </div>
        </div>
    );
}

function ArchiveView({ archive, viewEntry, exhibitionMode, setExhibitionMode, startAuction }) {
    return (
        <div style={{ padding: '60px 0' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <h2 style={{ 
                    fontSize: '32px', 
                    fontWeight: '900', 
                    textTransform: 'uppercase',
                    letterSpacing: '-1px',
                    margin: 0
                }}>
                    Archive — {archive.length} Works
                </h2>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                    {archive.length > 0 && (
                        <>
                            <button
                                onClick={() => setExhibitionMode(!exhibitionMode)}
                                style={{
                                    padding: '14px 28px',
                                    border: '3px solid #000',
                                    background: exhibitionMode ? '#ff00ff' : 'transparent',
                                    color: exhibitionMode ? 'white' : '#000',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    letterSpacing: '2px',
                                    fontFamily: 'Arial Black, Helvetica, sans-serif',
                                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {exhibitionMode ? 'Grid View' : 'Conduct Exhibition'}
                            </button>
                            <button
                                onClick={startAuction}
                                style={{
                                    padding: '14px 28px',
                                    border: '3px solid #000',
                                    background: '#ff0000',
                                    color: 'white',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    letterSpacing: '2px',
                                    fontFamily: 'Arial Black, Helvetica, sans-serif',
                                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Sell Collection
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {archive.length === 0 ? (
                <p style={{ 
                    fontSize: '18px', 
                    fontWeight: '700',
                    textAlign: 'center',
                    padding: '80px 0',
                    color: '#666'
                }}>
                    No entries yet. Be the first to contribute.
                </p>
            ) : exhibitionMode ? (
                <ExhibitionView archive={archive} viewEntry={viewEntry} />
            ) : (
                <div className="archive-grid">
                    {archive.map((entry) => (
                        <div 
                            key={entry.id}
                            className="archive-item"
                            onClick={() => viewEntry(entry)}
                        >
                            <img 
                                src={entry.image} 
                                alt={entry.critique.title}
                            />
                            <div className="archive-item-info">
                                <h3 className="archive-item-title">
                                    {entry.critique.title}
                                </h3>
                                <p className="archive-item-artist">
                                    {entry.critique.artist}
                                </p>
                                <p className="archive-item-year">
                                    {entry.critique.year}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ExhibitionView({ archive, viewEntry }) {
    // Distribute artworks across multiple "rooms"
    const worksPerRoom = Math.ceil(archive.length / 4);
    const rooms = [
        archive.slice(0, worksPerRoom),
        archive.slice(worksPerRoom, worksPerRoom * 2),
        archive.slice(worksPerRoom * 2, worksPerRoom * 3),
        archive.slice(worksPerRoom * 3)
    ];

    const renderRoomArtworks = (roomWorks, roomOffset) => {
        if (!roomWorks || roomWorks.length === 0) return null;
        
        return roomWorks.map((entry, index) => {
            const totalIndex = roomOffset + index;
            // Alternate between wall and floor placement
            const onFloor = index % 2 === 1;
            
            if (onFloor) {
                return (
                    <div 
                        key={entry.id}
                        className="floor-artwork"
                        onClick={() => viewEntry(entry)}
                        style={{ 
                            animationDelay: `${totalIndex * 0.15}s`,
                            left: `${80 + (index % 2) * 120}px`,
                            top: `${80 + Math.floor(index / 4) * 120}px`
                        }}
                    >
                        <img src={entry.image} alt={entry.critique.title} />
                    </div>
                );
            }
            
            return null;
        });
    };

    const renderWallArtworks = (roomWorks, roomOffset, wallType) => {
        if (!roomWorks || roomWorks.length === 0) return null;
        
        // Only show wall artworks (even indices)
        const wallWorks = roomWorks.filter((_, index) => index % 2 === 0);
        
        return wallWorks.slice(0, 2).map((entry, index) => {
            const originalIndex = roomWorks.indexOf(entry);
            const totalIndex = roomOffset + originalIndex;
            
            return (
                <div 
                    key={entry.id}
                    className="wall-artwork"
                    onClick={() => viewEntry(entry)}
                    style={{ animationDelay: `${totalIndex * 0.15}s` }}
                >
                    <img src={entry.image} alt={entry.critique.title} />
                </div>
            );
        });
    };

    return (
        <div className="exhibition-container">
            <div className="exhibition-isometric">
                {/* Room 1 - Top Left */}
                <div className="exhibition-room room-1">
                    <div className="room-walls">
                        <div className="room-wall wall-back">
                            {renderWallArtworks(rooms[0], 0, 'back')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[0], 0)}
                    </div>
                </div>

                {/* Room 2 - Top Right */}
                <div className="exhibition-room room-2">
                    <div className="room-walls">
                        <div className="room-wall wall-back">
                            {renderWallArtworks(rooms[1], worksPerRoom, 'back')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[1], worksPerRoom)}
                    </div>
                </div>

                {/* Room 3 - Bottom Left */}
                <div className="exhibition-room room-3">
                    <div className="room-walls">
                        <div className="room-wall wall-back">
                            {renderWallArtworks(rooms[2], worksPerRoom * 2, 'back')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[2], worksPerRoom * 2)}
                    </div>
                </div>

                {/* Room 4 - Bottom Right */}
                <div className="exhibition-room room-4">
                    <div className="room-walls">
                        <div className="room-wall wall-back">
                            {renderWallArtworks(rooms[3], worksPerRoom * 3, 'back')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[3], worksPerRoom * 3)}
                    </div>
                </div>

                {/* Connecting corridors */}
                <div className="corridor horizontal-corridor-1"></div>
                <div className="corridor horizontal-corridor-2"></div>
                <div className="corridor vertical-corridor-1"></div>
                <div className="corridor vertical-corridor-2"></div>
            </div>
        </div>
    );
}

function AuctionOverlay({ bids }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                maxWidth: '800px',
                maxHeight: '600px'
            }}>
                {bids.map((bid, index) => (
                    <div
                        key={bid.id}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 60 + 20}%`,
                            top: `${Math.random() * 60 + 20}%`,
                            background: 'white',
                            padding: '20px 30px',
                            border: '4px solid #000',
                            fontWeight: '900',
                            fontSize: '32px',
                            fontFamily: 'Arial Black, Helvetica, sans-serif',
                            boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.5)',
                            animation: 'bidPop 0.6s ease-out forwards',
                            zIndex: index
                        }}
                    >
                        ${bid.amount.toLocaleString()}
                    </div>
                ))}
                
                {bids.length >= 8 && (
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#ff0000',
                        color: 'white',
                        padding: '40px 80px',
                        border: '6px solid #000',
                        fontWeight: '900',
                        fontSize: '72px',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        boxShadow: '12px 12px 0px rgba(0, 0, 0, 0.7)',
                        animation: 'soldFlash 0.5s ease-out',
                        zIndex: 100
                    }}>
                        SOLD!
                    </div>
                )}
            </div>
        </div>
    );
}

function AuctionSummary({ summary, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '60px',
                border: '6px solid #000',
                maxWidth: '600px',
                boxShadow: '16px 16px 0px rgba(0, 0, 0, 0.5)',
                animation: 'summarySlide 0.5s ease-out'
            }}>
                <h2 style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    marginBottom: '40px',
                    fontFamily: 'Arial Black, Helvetica, sans-serif',
                    textAlign: 'center',
                    color: '#ff00ff'
                }}>
                    Collection Sold
                </h2>
                
                <div style={{
                    marginBottom: '30px',
                    fontSize: '24px',
                    fontWeight: '700',
                    lineHeight: '1.8'
                }}>
                    <p style={{ marginBottom: '16px' }}>
                        <span style={{ color: '#666' }}>Total Works:</span> {summary.works}
                    </p>
                    <p style={{ marginBottom: '16px' }}>
                        <span style={{ color: '#666' }}>Final Price Per Work:</span> ${summary.pricePerWork.toLocaleString()}
                    </p>
                    <p style={{
                        fontSize: '36px',
                        color: '#ff0000',
                        fontWeight: '900',
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '3px solid #000'
                    }}>
                        Total Value: ${summary.totalValue.toLocaleString()}
                    </p>
                </div>
                
                <div style={{
                    background: '#ffff00',
                    padding: '20px',
                    border: '3px solid #000',
                    marginBottom: '30px'
                }}>
                    <p style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        lineHeight: '1.6',
                        textAlign: 'center'
                    }}>
                        Your collection has been acquired by an anonymous collector. The archive has been cleared. 
                        All institutional legitimacy has been successfully liquidated.
                    </p>
                </div>
                
                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: '#000',
                        color: 'white',
                        border: 'none',
                        fontWeight: '900',
                        fontSize: '18px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        letterSpacing: '2px'
                    }}
                >
                    Start New Collection
                </button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);