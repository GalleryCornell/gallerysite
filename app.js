const { useState, useEffect, useRef } = React;

const API_URL = 'https://gallerysite-production.up.railway.app/api';

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
    const [debugMode, setDebugMode] = useState(false);
    const [auctionActive, setAuctionActive] = useState(false);
    const [auctionBids, setAuctionBids] = useState([]);
    const [auctionSummary, setAuctionSummary] = useState(null);
    const [galleryFunds, setGalleryFunds] = useState(() => {
        const saved = localStorage.getItem('galleryFunds');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [artworkPrices, setArtworkPrices] = useState({});

    // Individual auction states
    const [selectedArtworkForAuction, setSelectedArtworkForAuction] = useState(null);
    const [auctionStep, setAuctionStep] = useState(null); // 'context-menu', 'price-select', 'bidding', 'sold'
    const [startingPrice, setStartingPrice] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [currentBid, setCurrentBid] = useState(null);
    const [individualBids, setIndividualBids] = useState([]);
    const [biddingActive, setBiddingActive] = useState(false);
    const [finalBuyer, setFinalBuyer] = useState(null);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const biddingActiveRef = useRef(false);

    // Save gallery funds to localStorage whenever it changes
    React.useEffect(() => {
        localStorage.setItem('galleryFunds', galleryFunds.toString());
    }, [galleryFunds]);

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
        buyerProfiles: [
            {
                name: "Helena Kristiansen",
                title: "Director, Nordic Contemporary Foundation",
                bio: "Helena Kristiansen has spent two decades building one of Scandinavia's most enigmatic private collections. A former philosophy professor who pivoted to collecting after an inheritance from an uncle she claims never to have met, Kristiansen is known for acquiring works that 'resist coherence.' Her collection is stored in a climate-controlled warehouse in rural Norway that no journalist has ever been permitted to photograph.",
                photo: "👤"
            },
            {
                name: "Dr. Marcus Chen",
                title: "Anonymous Collector & Tech Entrepreneur",
                bio: "After selling his algorithmic trading company for an undisclosed sum, Dr. Marcus Chen vanished from Silicon Valley to pursue what he calls 'investments in cultural ambiguity.' He collects exclusively through intermediaries and has never publicly displayed a single work. Sources close to Chen suggest his collection is intended as 'a museum that will open after I'm gone, or perhaps never.'",
                photo: "👤"
            },
            {
                name: "The Vestergaard Trust",
                title: "Anonymous Institutional Collector",
                bio: "The Vestergaard Trust operates from an unmarked office in Copenhagen's financial district. Established in 1987 by funds of disputed origin, the Trust acquires contemporary art according to criteria that remain confidential. Rumored to own over 400 works, none have been publicly exhibited. The Trust's sole representative, known only as 'K.V.,' conducts all acquisitions via encrypted correspondence.",
                photo: "👤"
            },
            {
                name: "Sophia Alderman",
                title: "Curator & Private Collector",
                bio: "Sophia Alderman built her reputation curating institutional exhibitions that were 'more notable for what they excluded than what they showed.' After a controversial departure from the Tate in 2019, she retreated to a restored monastery in Portugal where she maintains a private collection she describes as 'a catalog of abandoned artistic intentions.' Visits are by invitation only, and guests are required to sign NDAs.",
                photo: "👤"
            },
            {
                name: "The Institute of Residual Culture",
                title: "Collective Acquisition Entity",
                bio: "The Institute of Residual Culture is not a place but a dispersed network of collectors who pool resources to acquire works deemed 'culturally stranded.' Founded in 2015, the collective has no permanent address, no board of directors, and no stated mission beyond 'preventing the disappearance of disappearing things.' Acquired works are distributed among members according to a rotating system that remains opaque to outsiders.",
                photo: "👤"
            },
            {
                name: "Dmitri Volkov",
                title: "Oligarch & Cultural Preservationist",
                bio: "Once known for funding avant-garde theater in Moscow, Dmitri Volkov's collecting practices became more cryptic following his quiet departure from Russia in 2014. Now based in London, he acquires art through a web of shell companies and third-party representatives. His collection is believed to be housed in multiple undisclosed locations across three continents. Volkov himself has not been photographed since 2016.",
                photo: "👤"
            },
            {
                name: "Yuki Tanaka",
                title: "Pharmaceutical Heir & Aesthetic Theorist",
                bio: "Yuki Tanaka inherited a pharmaceutical fortune at 28 and immediately withdrew from public life to pursue what she calls 'the collection as negative space.' Her acquisitions are reportedly stored in a purpose-built vault beneath her family's estate outside Tokyo. Tanaka has published several pseudonymous essays on the 'ethics of ownership' but refuses all interview requests and communicates only through her attorney.",
                photo: "👤"
            },
            {
                name: "The Berlinische Collective",
                title: "Anonymous Artistic Cooperative",
                bio: "The Berlinische Collective emerged in 2017 as a group of anonymous artists who collect the work of others 'to remove it from circulation.' Their manifesto, if it can be called that, argues that art achieves its final form only when withdrawn from view. The collective's membership is unknown, and works they acquire simply vanish. They are funded by a trust established by a deceased art dealer whose will stipulated the money be used for 'purposes antithetical to the market.'",
                photo: "👤"
            }
        ]
    };

    useEffect(() => {
        if (currentView === 'archive' && !auctionSummary) {
            loadArchive();
        }
    }, [currentView]);

    // Load archive on mount to show correct count
    useEffect(() => {
        loadArchive();
    }, []);

    // Check for saved auction summary on mount (in case of page reload)
    useEffect(() => {
        const savedSummary = localStorage.getItem('lastAuctionSummary');
        if (savedSummary) {
            try {
                const summaryData = JSON.parse(savedSummary);
                console.log('Found saved auction summary, restoring:', summaryData);
                setAuctionSummary(summaryData);
                setCurrentView('archive');
                // Clear the saved summary so it doesn't show again
                localStorage.removeItem('lastAuctionSummary');
            } catch (error) {
                console.error('Error parsing saved auction summary:', error);
            }
        }
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

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1920;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG at 85% quality
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.85);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Compress image before processing
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(compressedFile);

        setLoading(true);
        setImage(compressedFile);

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

    // Individual artwork auction functions
    const selectArtworkForAuction = (artwork, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setContextMenuPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        setSelectedArtworkForAuction(artwork);
        setAuctionStep('context-menu');
    };

    const openAuctionFromMenu = () => {
        setAuctionStep('price-select');
    };

    const startIndividualAuction = async () => {
        setStartingPrice(selectedPrice);
        setCurrentBid(selectedPrice);
        setAuctionStep('bidding');
        setIndividualBids([]);
        setBiddingActive(true);
        biddingActiveRef.current = true;

        // Initial pause before showing "Bidding starts at" message
        await new Promise(resolve => setTimeout(resolve, 800));

        // Show initial "Bidding starts at" message
        setIndividualBids([{
            id: -1,
            amount: selectedPrice,
            timestamp: Date.now(),
            isStartMessage: true
        }]);

        // Pause before actual bids start
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Generate more bids with smaller increments
        const numBids = Math.floor(Math.random() * 10) + 15; // 15-24 bids
        const maxBid = selectedPrice * (1.8 + Math.random() * 1.5); // 1.8x to 3.3x starting price
        const bidIncrement = (maxBid - selectedPrice) / numBids;

        for (let i = 0; i < numBids; i++) {
            // Calculate delay: progressively slower
            let baseDelay;
            if (i < 5) {
                baseDelay = 600; // First 5 bids: fast
            } else if (i < 10) {
                baseDelay = 900; // Next 5: medium
            } else if (i < 15) {
                baseDelay = 1400; // Next 5: slow
            } else {
                baseDelay = 2200; // Final bids: very slow
            }
            const randomVariation = Math.random() * 300;
            const delay = baseDelay + randomVariation;

            await new Promise(resolve => setTimeout(resolve, delay));

            if (!biddingActiveRef.current) break; // Allow manual stopping

            // Smaller, more realistic bid increments
            const bidAmount = Math.floor(selectedPrice + (bidIncrement * (i + 1)) + (Math.random() * 2000));
            setCurrentBid(bidAmount);
            setIndividualBids(prev => [...prev, {
                id: i,
                amount: bidAmount,
                timestamp: Date.now(),
                isStartMessage: false
            }]);
        }

        setBiddingActive(false);
        biddingActiveRef.current = false;
    };

    const endBidding = async () => {
        setBiddingActive(false);
        biddingActiveRef.current = false;

        // Select random buyer
        const buyer = critiqueTemplates.buyerProfiles[Math.floor(Math.random() * critiqueTemplates.buyerProfiles.length)];
        setFinalBuyer(buyer);
        setAuctionStep('sold');
    };

    const completeSale = async () => {
        // Update gallery funds
        setGalleryFunds(prevFunds => prevFunds + currentBid);

        // Delete from archive
        try {
            await fetch(`${API_URL}/archive/${selectedArtworkForAuction.id}`, {
                method: 'DELETE'
            });

            // Reload archive
            await loadArchive();
        } catch (error) {
            console.error('Error deleting artwork:', error);
        }

        // Reset auction states
        setSelectedArtworkForAuction(null);
        setAuctionStep(null);
        setStartingPrice(null);
        setCurrentBid(null);
        setIndividualBids([]);
        setFinalBuyer(null);
    };

    const cancelAuction = () => {
        setSelectedArtworkForAuction(null);
        setAuctionStep(null);
        setStartingPrice(null);
        setSelectedPrice(null);
        setCurrentBid(null);
        setIndividualBids([]);
        setBiddingActive(false);
        setFinalBuyer(null);
    };

    const startAuction = async () => {
        if (archive.length === 0) return;

        setAuctionActive(true);
        setAuctionBids([]);
        setExhibitionMode(false); // Reset exhibition view

        // Generate individual prices for each artwork
        const prices = {};
        let totalValue = 0;
        archive.forEach(entry => {
            const price = Math.floor(Math.random() * 150000) + 50000; // $50k - $200k
            prices[entry.id] = price;
            totalValue += price;
        });
        setArtworkPrices(prices);

        // Generate random bid amounts for display
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

        // Calculate total
        const totalWorks = archive.length;

        // Clear archive locally immediately (don't wait for server)
        setArchive([]);

        // Clear archive on server
        try {
            await fetch(`${API_URL}/archive/clear`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error clearing archive:', error);
        }

        // Show summary - this should persist until user closes it
        const summaryData = {
            works: totalWorks,
            totalValue: totalValue
        };

        console.log('Setting auction summary:', summaryData);

        // Persist summary to localStorage in case of page reload
        localStorage.setItem('lastAuctionSummary', JSON.stringify(summaryData));

        setAuctionSummary(summaryData);

        // Update gallery funds
        setGalleryFunds(prevFunds => prevFunds + totalValue);

        // Clear artwork prices since archive is cleared
        setArtworkPrices({});

        setAuctionActive(false);
        console.log('Auction complete, summary should be visible now');
    };

    const closeAuctionSummary = () => {
        console.log('Closing auction summary - user clicked button');
        setAuctionSummary(null);
        setAuctionBids([]);
        // Keep user on archive page after closing summary
        setCurrentView('archive');
    };

    return (
        <div>
            <header>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="site-title" onClick={resetAnalysis} style={{cursor: 'pointer'}}>
                                The Faux Critic
                            </h1>
                            <p className="site-subtitle">Institutional Analysis Archive</p>
                        </div>
                        {galleryFunds > 0 && (
                            <div style={{
                                background: '#ffff00',
                                border: '3px solid #000',
                                padding: '16px 24px',
                                boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
                                marginTop: '8px'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    marginBottom: '4px'
                                }}>
                                    Gallery Funds
                                </div>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: '900',
                                    fontFamily: 'Arial Black, Helvetica, sans-serif',
                                    color: '#ff0000'
                                }}>
                                    ${galleryFunds.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="nav-buttons">
                        <button
                            className="nav-button"
                            onClick={resetAnalysis}
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
                            debugMode={debugMode}
                            setDebugMode={setDebugMode}
                            startAuction={startAuction}
                            artworkPrices={artworkPrices}
                            selectArtworkForAuction={selectArtworkForAuction}
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
                        {auctionStep === 'context-menu' && selectedArtworkForAuction && (
                            <ArtworkContextMenu
                                artwork={selectedArtworkForAuction}
                                position={contextMenuPosition}
                                onViewInfo={() => {
                                    cancelAuction();
                                    viewEntry(selectedArtworkForAuction);
                                }}
                                onOpenAuction={openAuctionFromMenu}
                                onCancel={cancelAuction}
                            />
                        )}
                        {auctionStep === 'price-select' && selectedArtworkForAuction && (
                            <PriceSelectionOverlay
                                artwork={selectedArtworkForAuction}
                                selectedPrice={selectedPrice}
                                onSelectPrice={setSelectedPrice}
                                onStartBidding={startIndividualAuction}
                                onCancel={cancelAuction}
                                dimGallery={true}
                            />
                        )}
                        {auctionStep === 'bidding' && (
                            <BiddingOverlay
                                artwork={selectedArtworkForAuction}
                                currentBid={currentBid}
                                bids={individualBids}
                                biddingActive={biddingActive}
                                onEndBidding={endBidding}
                            />
                        )}
                        {auctionStep === 'sold' && finalBuyer && (
                            <BuyerRevealOverlay
                                artwork={selectedArtworkForAuction}
                                finalPrice={currentBid}
                                buyer={finalBuyer}
                                onComplete={completeSale}
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

function ArchiveView({ archive, viewEntry, exhibitionMode, setExhibitionMode, debugMode, setDebugMode, startAuction, artworkPrices, selectArtworkForAuction }) {
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
                            {exhibitionMode && (
                                <button
                                    onClick={() => setDebugMode(!debugMode)}
                                    style={{
                                        padding: '14px 28px',
                                        border: '3px solid #000',
                                        background: debugMode ? '#00ff00' : 'transparent',
                                        color: debugMode ? '#000' : '#000',
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
                                    Debug Mode
                                </button>
                            )}
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
                <ExhibitionView archive={archive} viewEntry={viewEntry} debugMode={debugMode} selectArtworkForAuction={selectArtworkForAuction} />
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
                                {artworkPrices[entry.id] && (
                                    <p style={{
                                        fontSize: '18px',
                                        fontWeight: '900',
                                        color: '#ff0000',
                                        marginTop: '8px',
                                        fontFamily: 'Arial Black, Helvetica, sans-serif'
                                    }}>
                                        ${artworkPrices[entry.id].toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ExhibitionView({ archive, viewEntry, debugMode, selectArtworkForAuction }) {
    // Position state for debug mode
    const [leftWallPos, setLeftWallPos] = React.useState({ rotateY: -90, translateX: 150, translateY: -100, translateZ: 0 });
    const [rightWallPos, setRightWallPos] = React.useState({ rotateX: -90, translateX: 0, translateY: 0, translateZ: 0 });
    const [floorPos, setFloorPos] = React.useState({ rotateX: 0, translateX: 0, translateY: -100, translateZ: 100 });

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
                        onClick={(e) => selectArtworkForAuction(entry, e)}
                        style={{
                            animationDelay: `${totalIndex * 0.15}s`,
                            cursor: 'pointer'
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

        // Distribute artworks between left and right walls
        // Left wall gets first artwork (index 0), right wall gets second artwork (index 1)
        const wallIndex = wallType === 'left' ? 0 : 1;
        const artwork = wallWorks[wallIndex];

        if (!artwork) return null;

        const originalIndex = roomWorks.indexOf(artwork);
        const totalIndex = roomOffset + originalIndex;

        return (
            <div
                key={artwork.id}
                className="wall-artwork"
                onClick={(e) => selectArtworkForAuction(artwork, e)}
                style={{ animationDelay: `${totalIndex * 0.15}s`, cursor: 'pointer' }}
            >
                <img src={artwork.image} alt={artwork.critique.title} />
            </div>
        );
    };

    const buildTransform = (pos) => {
        let parts = [];
        if (pos.rotateX !== undefined && pos.rotateX !== 0) parts.push(`rotateX(${pos.rotateX}deg)`);
        if (pos.rotateY !== undefined && pos.rotateY !== 0) parts.push(`rotateY(${pos.rotateY}deg)`);
        if (pos.rotateZ !== undefined && pos.rotateZ !== 0) parts.push(`rotateZ(${pos.rotateZ}deg)`);
        if (pos.translateZ !== undefined && pos.translateZ !== 0) parts.push(`translateZ(${pos.translateZ}px)`);
        if (pos.translateX !== undefined && pos.translateX !== 0) parts.push(`translateX(${pos.translateX}px)`);
        if (pos.translateY !== undefined && pos.translateY !== 0) parts.push(`translateY(${pos.translateY}px)`);
        return parts.join(' ');
    };

    return (
        <div className="exhibition-container">
            {debugMode && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    right: '20px',
                    background: 'white',
                    border: '3px solid black',
                    padding: '20px',
                    zIndex: 10000,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>Debug Controls</h3>

                    <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,0,0,0.1)' }}>
                        <strong style={{ color: 'red' }}>LEFT WALL (Red)</strong>
                        <div>rotateY: <input type="number" value={leftWallPos.rotateY} onChange={(e) => setLeftWallPos({...leftWallPos, rotateY: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateX: <input type="number" value={leftWallPos.translateX} onChange={(e) => setLeftWallPos({...leftWallPos, translateX: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateY: <input type="number" value={leftWallPos.translateY} onChange={(e) => setLeftWallPos({...leftWallPos, translateY: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateZ: <input type="number" value={leftWallPos.translateZ} onChange={(e) => setLeftWallPos({...leftWallPos, translateZ: Number(e.target.value)})} style={{width: '60px'}} /></div>
                    </div>

                    <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,0,255,0.1)' }}>
                        <strong style={{ color: 'blue' }}>RIGHT WALL (Blue)</strong>
                        <div>rotateX: <input type="number" value={rightWallPos.rotateX} onChange={(e) => setRightWallPos({...rightWallPos, rotateX: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateX: <input type="number" value={rightWallPos.translateX} onChange={(e) => setRightWallPos({...rightWallPos, translateX: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateY: <input type="number" value={rightWallPos.translateY} onChange={(e) => setRightWallPos({...rightWallPos, translateY: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateZ: <input type="number" value={rightWallPos.translateZ} onChange={(e) => setRightWallPos({...rightWallPos, translateZ: Number(e.target.value)})} style={{width: '60px'}} /></div>
                    </div>

                    <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,255,0,0.1)' }}>
                        <strong style={{ color: 'green' }}>FLOOR (Green)</strong>
                        <div>rotateX: <input type="number" value={floorPos.rotateX} onChange={(e) => setFloorPos({...floorPos, rotateX: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateX: <input type="number" value={floorPos.translateX} onChange={(e) => setFloorPos({...floorPos, translateX: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateY: <input type="number" value={floorPos.translateY} onChange={(e) => setFloorPos({...floorPos, translateY: Number(e.target.value)})} style={{width: '60px'}} /></div>
                        <div>translateZ: <input type="number" value={floorPos.translateZ} onChange={(e) => setFloorPos({...floorPos, translateZ: Number(e.target.value)})} style={{width: '60px'}} /></div>
                    </div>

                    <button onClick={() => {
                        console.log('LEFT WALL:', buildTransform(leftWallPos));
                        console.log('RIGHT WALL:', buildTransform(rightWallPos));
                        console.log('FLOOR:', buildTransform(floorPos));
                    }} style={{ padding: '10px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Log Transforms to Console
                    </button>
                </div>
            )}

            <div className="exhibition-isometric">
                {/* Room 1 - Top Left */}
                <div className="exhibition-room room-1">
                    <div className="room-walls">
                        <div className="room-wall wall-left" style={{
                            ...(debugMode ? { border: '3px solid red', background: 'rgba(255,0,0,0.1)' } : {}),
                            ...(debugMode ? { transform: buildTransform(leftWallPos) } : {})
                        }}>
                            {debugMode && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'red', color: 'white', padding: '5px', fontSize: '12px', fontWeight: 'bold', zIndex: 1000 }}>LEFT WALL</div>}
                            {renderWallArtworks(rooms[0], 0, 'left')}
                        </div>
                        <div className="room-wall wall-right" style={{
                            ...(debugMode ? { border: '3px solid blue', background: 'rgba(0,0,255,0.1)' } : {}),
                            ...(debugMode ? { transform: buildTransform(rightWallPos) } : {})
                        }}>
                            {debugMode && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'blue', color: 'white', padding: '5px', fontSize: '12px', fontWeight: 'bold', zIndex: 1000 }}>RIGHT WALL</div>}
                            {renderWallArtworks(rooms[0], 0, 'right')}
                        </div>
                    </div>
                    <div className="room-floor" style={{
                        ...(debugMode ? { border: '3px solid green', background: 'rgba(0,255,0,0.1)' } : {}),
                        ...(debugMode ? { transform: buildTransform(floorPos) } : {})
                    }}>
                        {debugMode && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'green', color: 'white', padding: '5px', fontSize: '12px', fontWeight: 'bold', zIndex: 1000 }}>FLOOR</div>}
                        {renderRoomArtworks(rooms[0], 0)}
                    </div>
                </div>

                {/* Room 2 - Top Right */}
                <div className="exhibition-room room-2">
                    <div className="room-walls">
                        <div className="room-wall wall-left">
                            {renderWallArtworks(rooms[1], worksPerRoom, 'left')}
                        </div>
                        <div className="room-wall wall-right">
                            {renderWallArtworks(rooms[1], worksPerRoom, 'right')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[1], worksPerRoom)}
                    </div>
                </div>

                {/* Room 3 - Bottom Left */}
                <div className="exhibition-room room-3">
                    <div className="room-walls">
                        <div className="room-wall wall-left">
                            {renderWallArtworks(rooms[2], worksPerRoom * 2, 'left')}
                        </div>
                        <div className="room-wall wall-right">
                            {renderWallArtworks(rooms[2], worksPerRoom * 2, 'right')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[2], worksPerRoom * 2)}
                    </div>
                </div>

                {/* Room 4 - Bottom Right */}
                <div className="exhibition-room room-4">
                    <div className="room-walls">
                        <div className="room-wall wall-left">
                            {renderWallArtworks(rooms[3], worksPerRoom * 3, 'left')}
                        </div>
                        <div className="room-wall wall-right">
                            {renderWallArtworks(rooms[3], worksPerRoom * 3, 'right')}
                        </div>
                    </div>
                    <div className="room-floor">
                        {renderRoomArtworks(rooms[3], worksPerRoom * 3)}
                    </div>
                </div>
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
                        <span style={{ color: '#666' }}>Total Works Sold:</span> {summary.works}
                    </p>
                    <p style={{
                        fontSize: '42px',
                        color: '#ff0000',
                        fontWeight: '900',
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '3px solid #000'
                    }}>
                        Total: ${summary.totalValue.toLocaleString()}
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

// Artwork Context Menu
function ArtworkContextMenu({ artwork, position, onViewInfo, onOpenAuction, onCancel }) {
    return (
        <div
            onClick={onCancel}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 2000
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    border: '3px solid #000',
                    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.5)',
                    minWidth: '220px',
                    animation: 'slideUp 0.2s ease-out'
                }}
            >
                <div style={{
                    padding: '12px 15px',
                    borderBottom: '2px solid #000',
                    background: '#f5f5f5'
                }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '900',
                        marginBottom: '3px'
                    }}>
                        {artwork.critique.title}
                    </h3>
                    <p style={{
                        fontSize: '11px',
                        color: '#666',
                        fontWeight: '700'
                    }}>
                        {artwork.critique.artist}, {artwork.critique.year}
                    </p>
                </div>

                <div style={{ padding: '8px' }}>
                    <button
                        onClick={onViewInfo}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '8px',
                            background: 'white',
                            border: '2px solid #000',
                            fontWeight: '900',
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontFamily: 'Arial Black, Helvetica, sans-serif',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = '#f5f5f5';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'white';
                        }}
                    >
                        More Info
                    </button>

                    <button
                        onClick={onOpenAuction}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: '#ffff00',
                            border: '2px solid #000',
                            fontWeight: '900',
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontFamily: 'Arial Black, Helvetica, sans-serif',
                            boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = '#ff00ff';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = '#ffff00';
                            e.target.style.color = '#000';
                        }}
                    >
                        Open Auction
                    </button>
                </div>
            </div>
        </div>
    );
}

// Price Selection Overlay
function PriceSelectionOverlay({ artwork, selectedPrice, onSelectPrice, onStartBidding, onCancel }) {
    const priceOptions = [
        { label: '$25,000', value: 25000 },
        { label: '$50,000', value: 50000 },
        { label: '$75,000', value: 75000 },
        { label: '$100,000', value: 100000 }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                border: '4px solid #000',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.5)'
            }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    marginBottom: '15px',
                    fontFamily: 'Arial Black, Helvetica, sans-serif'
                }}>
                    Select Starting Price
                </h2>

                <div style={{
                    marginBottom: '20px',
                    padding: '12px',
                    background: '#f5f5f5',
                    border: '2px solid #000'
                }}>
                    <img
                        src={artwork.image}
                        alt={artwork.critique.title}
                        style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            marginBottom: '10px'
                        }}
                    />
                    <h3 style={{ fontSize: '15px', fontWeight: '900', marginBottom: '3px' }}>
                        {artwork.critique.title}
                    </h3>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#666' }}>
                        {artwork.critique.artist}, {artwork.critique.year}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '15px'
                }}>
                    {priceOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => onSelectPrice(option.value)}
                            style={{
                                padding: '12px',
                                background: selectedPrice === option.value ? '#ff00ff' : '#ffff00',
                                color: selectedPrice === option.value ? 'white' : '#000',
                                border: '3px solid #000',
                                fontWeight: '900',
                                fontSize: '16px',
                                cursor: 'pointer',
                                fontFamily: 'Arial Black, Helvetica, sans-serif',
                                boxShadow: selectedPrice === option.value ? '6px 6px 0px rgba(0, 0, 0, 0.5)' : '3px 3px 0px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onStartBidding}
                    disabled={!selectedPrice}
                    style={{
                        width: '100%',
                        padding: '14px',
                        marginBottom: '12px',
                        background: selectedPrice ? '#00ff00' : '#ccc',
                        color: selectedPrice ? '#000' : '#666',
                        border: '3px solid #000',
                        fontWeight: '900',
                        fontSize: '16px',
                        textTransform: 'uppercase',
                        cursor: selectedPrice ? 'pointer' : 'not-allowed',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        letterSpacing: '1px',
                        boxShadow: selectedPrice ? '6px 6px 0px rgba(0, 0, 0, 0.5)' : 'none',
                        opacity: selectedPrice ? 1 : 0.5
                    }}
                >
                    Start Bidding
                </button>

                <button
                    onClick={onCancel}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#000',
                        color: 'white',
                        border: 'none',
                        fontWeight: '900',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        letterSpacing: '1px'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// Bidding Overlay - Full Screen with Message Bubbles
function BiddingOverlay({ artwork, currentBid, bids, biddingActive, onEndBidding }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 2000,
            overflow: 'hidden'
        }}>
            {/* Bid bubbles - staggering left and right */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                maxWidth: '600px',
                height: '60%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: '10px',
                overflow: 'visible',
                pointerEvents: 'none'
            }}>
                {bids.map((bid, index) => {
                    const isStartMessage = bid.isStartMessage;
                    const isLatestBid = index === bids.length - 1 && !isStartMessage;

                    return (
                        <div
                            key={bid.id}
                            style={{
                                alignSelf: isStartMessage ? 'center' : (index % 2 === 0 ? 'flex-start' : 'flex-end'),
                                maxWidth: isStartMessage ? '80%' : '50%',
                                animation: 'bidSlide 0.4s ease-out',
                                pointerEvents: 'none'
                            }}
                        >
                            <div style={{
                                background: isStartMessage ? '#00ff00' : (isLatestBid ? '#ff00ff' : '#ffff00'),
                                color: isStartMessage ? '#000' : (isLatestBid ? 'white' : '#000'),
                                padding: isStartMessage ? '16px 24px' : '12px 20px',
                                border: '3px solid #000',
                                fontWeight: '900',
                                fontSize: isStartMessage ? '18px' : '20px',
                                fontFamily: 'Arial Black, Helvetica, sans-serif',
                                boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.5)',
                                borderRadius: isStartMessage ? '15px' : (index % 2 === 0 ? '0 15px 15px 15px' : '15px 0 15px 15px'),
                                textAlign: isStartMessage ? 'center' : 'left'
                            }}>
                                {isStartMessage ? `Bidding starts at $${bid.amount.toLocaleString()}` : `$${bid.amount.toLocaleString()}`}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Fixed header with current bid */}
            <div style={{
                position: 'fixed',
                top: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ffff00',
                border: '3px solid #000',
                padding: '12px 25px',
                boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.5)',
                zIndex: 2001
            }}>
                <div style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    marginBottom: '3px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Current Bid
                </div>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    fontFamily: 'Arial Black, Helvetica, sans-serif',
                    color: '#ff0000',
                    textAlign: 'center'
                }}>
                    ${currentBid ? currentBid.toLocaleString() : '0'}
                </div>
            </div>

            {/* Fixed footer with artwork info and button */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                borderTop: '4px solid #000',
                padding: '15px 20px',
                zIndex: 2001
            }}>
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '900',
                            marginBottom: '4px',
                            fontFamily: 'Arial Black, Helvetica, sans-serif'
                        }}>
                            {artwork.critique.title}
                        </h3>
                        <p style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#666'
                        }}>
                            {artwork.critique.artist}, {artwork.critique.year}
                        </p>
                    </div>

                    <button
                        onClick={onEndBidding}
                        disabled={biddingActive}
                        style={{
                            padding: '12px 25px',
                            background: biddingActive ? '#666' : '#ff0000',
                            color: 'white',
                            border: '3px solid #000',
                            fontWeight: '900',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            cursor: biddingActive ? 'not-allowed' : 'pointer',
                            fontFamily: 'Arial Black, Helvetica, sans-serif',
                            letterSpacing: '1px',
                            opacity: biddingActive ? 0.6 : 1,
                            boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.5)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {biddingActive ? 'Bidding...' : 'End Bidding'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Buyer Reveal Overlay
function BuyerRevealOverlay({ artwork, finalPrice, buyer, onComplete }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                border: '4px solid #000',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.5)',
                animation: 'slideUp 0.5s ease-out'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        background: '#ff0000',
                        color: 'white',
                        padding: '12px',
                        border: '3px solid #000',
                        fontSize: '32px',
                        fontWeight: '900',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        marginBottom: '10px',
                        boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.3)'
                    }}>
                        SOLD!
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        color: '#ff00ff'
                    }}>
                        ${finalPrice.toLocaleString()}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '20px',
                    padding: '15px',
                    background: '#f5f5f5',
                    border: '2px solid #000'
                }}>
                    <img
                        src={artwork.image}
                        alt={artwork.critique.title}
                        style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            border: '2px solid #000'
                        }}
                    />
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '5px' }}>
                            {artwork.critique.title}
                        </h3>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#666' }}>
                            {artwork.critique.artist}, {artwork.critique.year}
                        </p>
                    </div>
                </div>

                <div style={{
                    background: '#ffff00',
                    border: '3px solid #000',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.3)'
                }}>
                    <div style={{
                        fontSize: '48px',
                        textAlign: 'center',
                        marginBottom: '12px'
                    }}>
                        {buyer.photo}
                    </div>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '900',
                        textAlign: 'center',
                        marginBottom: '6px',
                        fontFamily: 'Arial Black, Helvetica, sans-serif'
                    }}>
                        {buyer.name}
                    </h3>
                    <p style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '12px',
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {buyer.title}
                    </p>
                    <p style={{
                        fontSize: '12px',
                        lineHeight: '1.5',
                        textAlign: 'justify'
                    }}>
                        {buyer.bio}
                    </p>
                </div>

                <button
                    onClick={onComplete}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#000',
                        color: 'white',
                        border: 'none',
                        fontWeight: '900',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontFamily: 'Arial Black, Helvetica, sans-serif',
                        letterSpacing: '1px'
                    }}
                >
                    Complete Sale
                </button>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);