# HyperVision ADVANCED PRACTICAL SIMULATION MODULE

## A. Platform Overview
The HyperVision Practical Simulation Framework is a premium, highly immersive virtual laboratory system. Designed to merge the tactile reality of physical science experiments with the analytical power of an AI-driven smart classroom, it supports robust, interactive 3D simulations across Physics, Chemistry, Biology, Mathematics, and Circuit Design. 

Students can interact intuitively with realistic apparatus using drag-and-drop mechanics and live sensor readouts. The embedded AI Tutor provides step-by-step guidance, detects miswiring or hazardous chemical combinations, and explains the conceptual framework behind observed phenomena.

## B. Department-wise Experiment List
### 1. Physics
- Verification of Ohm's Law
- Simple Pendulum and Time Period
- Refraction Through a Glass Prism
- Newton's Second Law of Motion
- Law of Reflection and Mirror Ray Diagram

### 2. Chemistry
- Acid-Base Titration
- Rate of Reaction
- Separation of Mixtures by Chromatography
- Electrolysis of Water
- Exothermic Reaction and Temperature Change

### 3. Biology
- Observation of Plant and Animal Cells
- Osmosis in Raisins or Potato Strips
- Photosynthesis Requirement Test
- Human Heart and Blood Circulation Model
- Enzyme Activity and Temperature/pH Effect

### 4. Mathematics
- Coordinate Geometry and Distance Formula
- Graphing Linear and Quadratic Functions
- Probability and Random Trials
- Mensuration of 3D Shapes
- Trigonometric Ratios in a Right Triangle

### 5. Circuit Design
- Basic LED Circuit with Resistor
- Series and Parallel Circuit Comparison
- Ohm's Law and Variable Resistance Circuit
- Capacitor Charging and Discharging
- Logic Gate Circuit Simulation

---

## C. Experiment Details

### Physics Experiment 1: Verification of Ohm’s Law
- **Objective**: Study the relationship between voltage, current, and resistance.
- **Apparatus**: Battery, resistor, ammeter, voltmeter, rheostat, switch, wires.
- **Process**:
  1. Build the circuit in series with ammeter and resistor.
  2. Connect voltmeter across the resistor.
  3. Close the switch.
  4. Increase voltage in measured steps using the rheostat.
  5. Record current for each voltage value.
  6. Plot V-I graph.
- **Simulation logic**: Real-time current flow vectors update based on `I = V / R`. The UI flags shorts immediately, overheating components visually if current exceeds safe limits.
- **Expected Results**: Linear V-I graph passing through the origin.
- **Common Mistakes**: Placing ammeter in parallel and voltmeter in series.
- **AI Tutor Hints**: "Check your ammeter placement—it should be part of the main loop, not bypassing the resistor."
- **Assessment**: Correct topology detected via node analysis; graph plotting accuracy.

### Chemistry Experiment 1: Acid-Base Titration
- **Objective**: Determine concentration of an unknown acid/base.
- **Apparatus**: Burette, pipette, conical flask, indicator, standard solution.
- **Process**:
  1. Fill burette with standard solution.
  2. Pipette analyte into flask.
  3. Add indicator.
  4. Add titrant dropwise.
  5. Stop at endpoint.
  6. Calculate concentration.
- **Simulation logic**: Track titrant volume with micro-precision. Color gradient shifts suddenly based on a simulated pH curve ($pH = pKa + \log([A-]/[HA])$).
- **Expected Results**: Light pink/colorless end state within a 0.1mL drop margin.
- **Common Mistakes**: Forgetting indicator; missing the endpoint by adding too much titrant.
- **AI Tutor Hints**: "The color remains pink! Switch the stopcock to dropwise before you overshoot the equivalence point."
- **Assessment**: Volume accuracy compared to theoretical equivalence point.

### Biology Experiment 1: Observation of Plant and Animal Cells
- **Objective**: Compare cellular structures under a microscope.
- **Apparatus**: Microscope, slide, cover slip, plant tissue, cheek cell sample, stain.
- **Process**:
  1. Prepare slide (add drop, sample, and cover slip).
  2. Focus microscope using coarse and fine knobs.
  3. Observe cell shape and organelles.
  4. Switch between plant and animal specimens.
  5. Label visible structures.
- **Simulation logic**: A rendering pipeline scales high-res vector imagery, blurring out of focus. Depth of field simulates strict z-axis focal plane limits.
- **Expected Results**: Rectangular/rigid plant cells vs. irregular animal cells.
- **Common Mistakes**: Crashing objectives into the slide; too much light.
- **AI Tutor Hints**: "Your slide is totally white. Try adjusting the diaphragm to reduce light, then slowly turn the fine focus."
- **Assessment**: Identification of organelles via hotspot clicks.

### Mathematics Experiment 1: Coordinate Geometry and Distance Formula
- **Objective**: Visualize points, distance, midpoint, and slope.
- **Apparatus**: Coordinate plane, draggable markers, geometric overlay HUD.
- **Process**:
  1. Place two points on grid.
  2. Calculate distance.
  3. Observe midpoint.
  4. Change coordinates.
  5. Compare formula with visual geometry.
- **Simulation logic**: Math engine actively links the 3D distance between points to a dynamic 2D grid HUD. Generates dynamic right triangles illustrating $dx$ and $dy$.
- **Expected Results**: Distance matches Cartesian formula output exactly.
- **Common Mistakes**: Swapping $x_1$ and $y_1$ in the calculation.
- **AI Tutor Hints**: "Remember, horizontal distance relates to the X-axis difference, while vertical relates to the Y."
- **Assessment**: Entering formula values correctly in the prompt matching the physical simulation.

### Circuit Design Experiment 1: Basic LED Circuit with Resistor
- **Objective**: Learn safe LED driving and polarity.
- **Apparatus**: Battery, LED, resistor, switch, wires, breadboard.
- **Process**:
  1. Place battery on board.
  2. Connect resistor in series.
  3. Connect LED with correct polarity.
  4. Add switch.
  5. Close circuit and observe light output.
- **Simulation logic**: Circuit node abstraction checks continuous loops. Diode evaluates forward voltage limit. Removes LED object with "pop" particle effect if resistor is omitted ($I > 20mA$).
- **Expected Results**: Glowing LED scaling intensity with chosen resistor block.
- **Common Mistakes**: Putting LED backwards; skipping the current-limiting resistor.
- **AI Tutor Hints**: "Look closely at the LED legs. The longer leg (anode) must face the positive battery terminal."
- **Assessment**: Safe circuit completion without component destruction.

*(Remaining 20 experiments follow similar structured patterns, mapped and deployed dynamically from `src/data/experiments.ts` into the engine.)*

---

## D. UI Structure
- **Left Panel (Hardware Drawer)**: Scrollable list of realistic apparatus categorized by department. Drag-and-drop into the central workspace.
- **Center Workspace (Simulation Engine)**: 3D Canvas utilizing WebGL (React Three Fiber) with physics environments and raycast collision handling. Provides spatial snapping for wire/tube connections.
- **Right Panel (Guide & AI Tutor)**: Active step tracking. Embedded conversational AI Tutor for text/voice queries ("Why did my bulb blow?").
- **Bottom Panel (Output/Console)**: Dynamic graph plotter, readouts (oscilloscopes, mass balances), calculations console, and report generator.
- **Top Bar**: Department dropdown, difficulty toggle, Multiplayer state, Master Play/Pause/Reset execution tools, and Export.

## E. Database Structure
- **Profiles**: `userId, name, departmentProgress, grades`
- **ExperimentData**: `id, category, title, apparatusList, stepJSON`
- **SavedStates**: `userId, experimentId, snapshotData, completionPercentage`
- **Assessments**: `userId, experimentId, finalScore, rubricScores, date`

## F. API Structure
- `GET /api/experiments/:categoryId` - Retrieve list of department simulations.
- `GET /api/experiment/:id` - Fetch 3D asset manifest, simulation rule configuration, and rubric.
- `POST /api/assessments/submit` - Compile raw state JSON and variables to Node backend for rigorous validation scoring.
- `POST /api/ai/guidance` - Submit current environment state blob and user question for nuanced AI response generation.

## G. Simulation Engine Logic
The engine utilizes a generalized **Entity-Component-System (ECS)** approach merged with strict **Event-Driven State**.
- **Nodes**: Logical endpoints (e.g., electrical pins, liquid outlets).
- **Physics**: Uses Ammo.js/Cannon.js for gravity, pendulum swings, particle paths.
- **Solvers**: 
  - Circuit Solver (Nodal Analysis for current/voltage).
  - Reaction Solver (Chemical kinetics engine updating volume/molarity ticks).
  - Ray Optics Engine (Raytracing local bounces off dynamic prisms).

## H. Roadmap for Future Expansion
1. **Phase 1**: WebGL physics core integration and release of 5 baseline experiments per department.
2. **Phase 2**: Real-time collaborative multiparty VR integration (multiplayer lab benches).
3. **Phase 3**: Custom Sandbox Mode allowing teachers to craft unique experiments using the item catalog without strictly enforced rules.
4. **Phase 4**: Advanced haptic feedback integration for specialized external laboratory peripheral controllers.
