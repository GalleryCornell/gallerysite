const { useState } = React;

function App() {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [critique, setCritique] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    // Pool of absurdist critique templates
    const critiqueTemplates = [
        {
            titleTemplates: [
                "Interval Between Surfaces",
                "The Perpetual Threshold",
                "Moment of Recursive Absence",
                "Fragmented Continuity #7",
                "Study in Temporal Displacement",
                "The Weight of Empty Gestures",
                "Archaeology of the Present",
                "Liminal Object (Untitled)",
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
        }
    ];

    const generateRandomCritique = () => {
        const template = critiqueTemplates[0];
        const year = 1960 + Math.floor(Math.random() * 64); // 1960-2023
        
        const title = template.titleTemplates[Math.floor(Math.random() * template.titleTemplates.length)];
        const artist = template.artistTemplates[Math.floor(Math.random() * template.artistTemplates.length)];
        const medium = template.mediumTemplates[Math.floor(Math.random() * template.mediumTemplates.length)];
        const label = template.labelTemplates[Math.floor(Math.random() * template.labelTemplates.length)];
        
        let critique = template.critiqueTemplates[Math.floor(Math.random() * template.critiqueTemplates.length)];
        critique = critique.replace(/{artist}/g, artist).replace(/{title}/g, title).replace(/{medium}/g, medium);
        
        const exhibitions = template.exhibitionTemplates[Math.floor(Math.random() * template.exhibitionTemplates.length)];
        const provenance = template.provenanceTemplates[Math.floor(Math.random() * template.provenanceTemplates.length)];
        
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

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Generate critique
        setLoading(true);
        setImage(file);

        // Simulate loading time for realism
        setTimeout(() => {
            const critiqueData = generateRandomCritique();
            setCritique(critiqueData);
            setLoading(false);
        }, 2000);
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
    };

    return (
        <div>
            <header>
                <div className="container">
                    <h1 className="site-title">The Faux Critic</h1>
                    <p className="site-subtitle">Institutional Analysis Service</p>
                </div>
            </header>

            <main className="container">
                {!loading && !critique && (
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

                {critique && !loading && (
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
                            <button
                                className="new-analysis-button"
                                onClick={resetAnalysis}
                            >
                                Submit New Work
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);