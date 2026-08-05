/* Gamified Writing Suite for Obsidian - 900-Level Skyrim Legendary Prestige Loop */
const { Plugin, PluginSettingTab, Setting, ItemView, Notice, MarkdownView } = require('obsidian');

const VIEW_TYPE_GAMIFIED_WRITING = 'gamified-writing-sidebar';

const ENCOURAGEMENT_QUOTES = [
  "Words add up faster than you think. Keep typing!",
  "A rough page is better than a blank page.",
  "Every word is a step toward your legacy.",
  "You are tilling the soil of your imagination.",
  "Victory is earned word by word!",
  "Your story deserves to be finished.",
  "Returning to the page is where real magic happens.",
  "Data recorded is victory earned!",
  "Your creative process isn't supposed to look like a straight line, Author. Your non-linear momentum is a high-level trait, not a bug in your code.",
  "Why force fragile daily streaks when your brain is built to unleash devastating hyperfocus bursts? Use the bursts when they charge up!",
  "Pausing your draft to rest during your low-estrogen phase isn't abandoning the quest—it's letting your creative mana recharge for the next boss fight.",
  "What’s the single easiest, lowest-friction micro-step we can take in your manuscript today? Even 10 seconds of interaction earns XP.",
  "You don't need to sit at a desk for eight hours to prove you're a real writer. You just need to capture the brilliance your mind generates on its own terms.",
  "Look at your quest log: how many times have you successfully returned to your stories after a pause? That’s proof of a master-class returning skill.",
  "Your story doesn't die when your executive battery dips; it quietly incubates in your background processing until your energy comes back online.",
  "Your brain builds such wildly vivid, detailed, and immersive worlds once you hit your flow state. I can't wait to see what you build next.",
  "Your hyperfixations aren't side-distractions—they are the deep-level research and specialized lore that will make your world-building unforgettable.",
  "The depth of your emotional processing is an epic-tier asset. It allows you to write characters with raw, visceral, and authentic resonance.",
  "Your pattern-matching neurology is remarkably talented at spotting plot holes and weaving intricate story arcs that leave readers speechless.",
  "Don't try to copy another player's playstyle. The realm needs the exact, specific, brilliant flavor of story only your AuDHD mind can forge.",
  "What if your intense sensitivity isn't a vulnerability, but your absolute highest stats attribute as a storyteller?",
  "When you're passionate about a scene, your interest-led mind guarantees your readers will feel every single drop of that intensity.",
  "You have full permission to write raw, dark, weird, hyper-specific, and intensely captivating fiction without needing to apologize to anyone.",
  "A rejection letter or a quiet launch is just data for your system log—it is never a verdict on your worth or your talent as a creator.",
  "It is completely safe for you to put your voice out into the world, even if your book isn't meant for every single NPC in the lobby.",
  "You don't need standard neurotypical approval to validate your status as a professional author. You're already doing the work.",
  "Look at the evidence in your inventory: you already know your words have the power to move, entertain, and deeply connect with people.",
  "Your value as a human being is entirely separate from your daily word count or publishing timeline. Remember your baseline worth.",
  "You're getting better and better at equipping mental armor to protect your creative core from external noise and criticism.",
  "Unlearn the lie that you have to burn out your health bar to earn your achievements. Sustainable victory is the real win.",
  "Your writing capacity naturally expands and contracts with your cycle. Both the high-energy surge and the deep-rest phase serve the book.",
  "Use high-estrogen phases to build and draft; use low-estrogen phases to edit, curate, and protect your energy reserves.",
  "How can we optimize your physical gaming station or writing nook to make it 10% more sensory-friendly for your body right now?",
  "Honoring your sensory limits today protects the longevity and durability of your writing career for years to come.",
  "Setting low-demand boundaries around your creative time isn't selfish—it's maintaining your primary power source.",
  "You aren't just dreaming about being an author—you are actively designing a professional platform that accommodates your exact brain.",
  "Your AuDHD mind is uniquely built for inventing original concepts, fresh tropes, and breathtaking magic systems that no one else could conceive.",
  "You are the author of your books, and you are the architect of a creative life that actually works for you. Step up to the table—it's your turn to play."
];

// Tier 1 (Levels 1-300)
const TIER_1_CROPS = [
  { name: 'Parsnip', targetWords: 50, emoji: '🥕' },
  { name: 'Potato', targetWords: 100, emoji: '🥔' },
  { name: 'Rhubarb', targetWords: 150, emoji: '🌿' },
  { name: 'Strawberry', targetWords: 200, emoji: '🍓' },
  { name: 'Blueberry', targetWords: 250, emoji: '🫐' },
  { name: 'Starfruit', targetWords: 300, emoji: '🌟' }
];

const TIER_1_MONSTERS = [
  { name: 'Imp', targetWords: 50, emoji: '😈' },
  { name: 'Goblin', targetWords: 100, emoji: '👺' },
  { name: 'Skeleton', targetWords: 150, emoji: '💀' },
  { name: 'Zombie', targetWords: 200, emoji: '🧟' },
  { name: 'Ghoul', targetWords: 250, emoji: '👻' },
  { name: 'Giant Ant', targetWords: 300, emoji: '🐜' }
];

// Tier 2 (Levels 301-600)
const TIER_2_CROPS = [
  { name: 'Cauliflower', targetWords: 50, emoji: '🥦' },
  { name: 'Melon', targetWords: 100, emoji: '🍉' },
  { name: 'Pumpkin', targetWords: 150, emoji: '🎃' },
  { name: 'Ancient Fruit', targetWords: 200, emoji: '🍇' },
  { name: 'Sweet Gem', targetWords: 250, emoji: '💎' },
  { name: 'Tea Leaves', targetWords: 300, emoji: '🍃' }
];

const TIER_2_MONSTERS = [
  { name: 'Grick', targetWords: 50, emoji: '🪱' },
  { name: 'Wyrmling', targetWords: 100, emoji: '🐉' },
  { name: 'Ogre', targetWords: 150, emoji: '👹' },
  { name: 'Troll', targetWords: 200, emoji: '🧌' },
  { name: 'Hydra', targetWords: 250, emoji: '🐍' },
  { name: 'Chimera', targetWords: 300, emoji: '🦁' }
];

// Tier 3 (Levels 601-900)
const TIER_3_ANIMALS = [
  { name: 'Chicken', targetWords: 50, emoji: '🐔' },
  { name: 'Rabbit', targetWords: 100, emoji: '🐇' },
  { name: 'Goose', targetWords: 150, emoji: '🪿' },
  { name: 'Sheep', targetWords: 200, emoji: '🐑' },
  { name: 'Pig', targetWords: 250, emoji: '🐖' },
  { name: 'Cow', targetWords: 300, emoji: '🐄' }
];

const TIER_3_MONSTERS = [
  { name: 'Golem', targetWords: 50, emoji: '🗿' },
  { name: 'Lich', targetWords: 100, emoji: '💀' },
  { name: 'Wizard', targetWords: 150, emoji: '🧙‍♂️' },
  { name: 'Fiend', targetWords: 200, emoji: '🔥' },
  { name: 'Demon', targetWords: 250, emoji: '👿' },
  { name: 'Dragon', targetWords: 300, emoji: '🐉' }
];

const CYCLE_PHASES = [
  "Menstruation",
  "Follicular",
  "Ovulation",
  "Luteal"
];

const DEFAULT_SETTINGS = {
  themeMode: 'crops',
  globalTargetGoal: 300,
  exportFolder: 'Writing Logs',
  totalXP: 0,
  level: 1,
  prestigeLoopCount: 0,
  authorStatus: 'Novice Writer',
  currentStreak: 0,
  lastActiveDate: '',
  dailyEnergy: 3,
  cyclePhase: 'Follicular',
  harvestedItems: {},
  sessionLogs: []
};

class GamifiedSidebarView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() { return VIEW_TYPE_GAMIFIED_WRITING; }
  getDisplayText() { return "Gamified Writing"; }
  getIcon() { return "gamepad"; }

  async onOpen() { this.updateView(); }

  updateView() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('gamified-sidebar-container');

    const s = this.plugin.settings;
    const randomQuote = ENCOURAGEMENT_QUOTES[Math.floor(Math.random() * ENCOURAGEMENT_QUOTES.length)];

    const currentTier = this.plugin.getCurrentTier();
    const activeList = this.plugin.getActiveItemList();

    const header = container.createEl('div', { cls: 'gw-header' });
    header.createEl('h3', { text: `Level ${s.level} / 900` });
    header.createEl('div', { text: `👑 Status: ${s.authorStatus}`, cls: 'gw-author-badge' });
    if (s.prestigeLoopCount > 0) {
      header.createEl('div', { text: `🔄 Legendary Loops Completed: ${s.prestigeLoopCount}`, cls: 'gw-loop-badge' });
    }
    header.createEl('div', { text: `🔥 Days Active: ${s.currentStreak} Days`, cls: 'gw-streak' });

    const xpIntoLevel = s.totalXP % 250;
    const levelBarContainer = container.createEl('div', { cls: 'gw-progress-wrapper' });
    levelBarContainer.createEl('div', { text: `XP: ${xpIntoLevel} / 250 (Total XP: ${s.totalXP})`, cls: 'gw-progress-label' });
    const levelBarBg = levelBarContainer.createEl('div', { cls: 'gw-progress-bg' });
    const levelBarFill = levelBarBg.createEl('div', { cls: 'gw-progress-fill' });
    levelBarFill.style.width = `${Math.min(100, (xpIntoLevel / 250) * 100)}%`;

    const quoteBox = container.createEl('div', { cls: 'gw-quote-box' });
    quoteBox.createEl('i', { text: `"${randomQuote}"` });

    const energySection = container.createEl('div', { cls: 'gw-energy-section' });
    energySection.createEl('h4', { text: '⚡ Energy & Cycle Tracking' });

    // Daily Energy (Stars)
    const dailyRow = energySection.createEl('div', { cls: 'gw-energy-row' });
    dailyRow.createEl('span', { text: 'Daily Energy: ' });
    const starContainer = dailyRow.createEl('span', { cls: 'gw-interactive-icons' });
    for (let i = 1; i <= 5; i++) {
      const star = starContainer.createEl('span', {
        text: i <= s.dailyEnergy ? '★' : '☆',
        cls: 'gw-star-icon'
      });
      star.onclick = () => {
        this.plugin.settings.dailyEnergy = i;
        this.plugin.saveSettings();
      };
    }

    // Cycle Phase (Dropdown Selector)
    const cycleRow = energySection.createEl('div', { cls: 'gw-energy-row' });
    cycleRow.createEl('span', { text: 'Cycle Phase: ' });
    const selectEl = cycleRow.createEl('select', { cls: 'gw-cycle-select' });
    CYCLE_PHASES.forEach(phase => {
      const opt = selectEl.createEl('option', { text: phase, value: phase });
      if (phase === s.cyclePhase) opt.selected = true;
    });
    selectEl.onchange = (e) => {
      this.plugin.settings.cyclePhase = e.target.value;
      this.plugin.saveSettings();
    };

    const sessionSection = container.createEl('div', { cls: 'gw-session-section' });
    sessionSection.createEl('h4', { text: '⏱️ Session Tracker' });

    const btn = sessionSection.createEl('button', {
      text: this.plugin.sessionActive ? 'Finish Writing Session' : 'Start Writing Session',
      cls: this.plugin.sessionActive ? 'gw-btn-stop' : 'gw-btn-start'
    });

    btn.onclick = () => {
      if (this.plugin.sessionActive) {
        this.plugin.stopSession();
      } else {
        this.plugin.startSession();
      }
    };

    if (this.plugin.sessionActive) {
      const netWords = Math.max(0, this.plugin.sessionWordsAdded - this.plugin.sessionWordsRemoved);
      const targetGoal = s.globalTargetGoal;
      const progressPct = Math.min(100, Math.round((netWords / targetGoal) * 100));

      const goalBarContainer = sessionSection.createEl('div', { cls: 'gw-progress-wrapper' });
      goalBarContainer.createEl('div', { text: `Live Goal: ${netWords} / ${targetGoal} words (${progressPct}%)`, cls: 'gw-progress-label' });
      const goalBarBg = goalBarContainer.createEl('div', { cls: 'gw-progress-bg' });
      const goalBarFill = goalBarBg.createEl('div', { cls: 'gw-progress-fill-active' });
      goalBarFill.style.width = `${progressPct}%`;

      const sorted = [...activeList].sort((a, b) => b.targetWords - a.targetWords);
      const matched = sorted.find(i => netWords >= i.targetWords);
      const pendingReward = matched ? `${matched.emoji} ${matched.name}` : 'None yet (Needs 50w)';

      const insights = sessionSection.createEl('div', { cls: 'gw-insights-box' });
      insights.createEl('div', { text: `Tracking File: ${this.plugin.activeSessionFile ? this.plugin.activeSessionFile.basename : 'Open Note'}` });
      insights.createEl('div', { text: `Pending Tier ${currentTier} Reward: ${pendingReward}`, cls: 'gw-highlight-text' });
      insights.createEl('div', { text: `Words Added: +${this.plugin.sessionWordsAdded}` });
      insights.createEl('div', { text: `Words Removed: -${this.plugin.sessionWordsRemoved}` });
      insights.createEl('div', { text: `Chars Added: +${this.plugin.sessionCharsAdded}` });
      insights.createEl('div', { text: `Pauses Detected: ${this.plugin.sessionPauses}` });
    }

    const recordSection = container.createEl('div', { cls: 'gw-record-section' });
    let categoryTitle = `🌾 Tier ${currentTier} Harvest Record`;
    if (s.themeMode === 'monsters') categoryTitle = `🗡️ Tier ${currentTier} Defeated Bestiary`;
    else if (currentTier === 3) categoryTitle = `🐄 Tier 3 Animal Sanctuary`;

    recordSection.createEl('h4', { text: categoryTitle });

    const recordGrid = recordSection.createEl('div', { cls: 'gw-record-grid' });
    const itemRecords = s.harvestedItems || {};

    activeList.forEach(item => {
      const card = recordGrid.createEl('div', { cls: 'gw-record-card' });
      card.createEl('div', { text: `${item.emoji} ${item.name}`, cls: 'gw-card-title' });
      card.createEl('div', { text: `Goal: ${item.targetWords}w` });
      card.createEl('div', { text: `Count: ${itemRecords[item.name] || 0}`, cls: 'gw-card-count' });
    });

    const historySection = container.createEl('div', { cls: 'gw-history-section' });
    historySection.createEl('h4', { text: '📊 Past Session Stats' });

    if (!s.sessionLogs || s.sessionLogs.length === 0) {
      historySection.createEl('div', { text: 'No recorded sessions yet.', cls: 'gw-empty-text' });
    } else {
      const logContainer = historySection.createEl('div', { cls: 'gw-log-list' });
      s.sessionLogs.slice(0, 5).forEach(log => {
        const item = logContainer.createEl('div', { cls: 'gw-log-item' });
        item.createEl('div', { text: `${log.timestamp} (${log.durationMinutes}m)`, cls: 'gw-log-title' });
        item.createEl('div', { text: `File: ${log.fileName}` });
        item.createEl('div', { text: `Words: +${log.wordsWritten} | -${log.wordsRemoved} | ${log.wpm} WPM` });
        item.createEl('div', { text: `Pauses: ${log.pausesCount} | Chars: ${log.charactersWritten}` });
        item.createEl('div', { text: `Mode: ${log.mode} (T${log.tier || 1}) | Reward: ${log.harvestedItem}` });
        item.createEl('div', { text: `Energy: ${'★'.repeat(log.dailyEnergy || 0)} | Cycle: ${log.cyclePhase || 'N/A'}` });
      });
    }
  }
}

class GamifiedWritingSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Gamified Writing Suite Settings' });

    new Setting(containerEl)
      .setName('Game Theme Mode')
      .setDesc('Choose whether writing sessions focus on farming/animals or slaying monsters.')
      .addDropdown(dropdown => dropdown
        .addOption('crops', 'Crops / Animals (Stardew Valley)')
        .addOption('monsters', 'Monsters (DnD)')
        .setValue(this.plugin.settings.themeMode)
        .onChange(async (value) => {
          this.plugin.settings.themeMode = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Session Target Goal (Words)')
      .setDesc('Set the target word count per session for progress tracking.')
      .addText(text => text
        .setValue(String(this.plugin.settings.globalTargetGoal))
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num > 0) {
            this.plugin.settings.globalTargetGoal = num;
            await this.plugin.saveSettings();
          }
        }));

    new Setting(containerEl)
      .setName('Log Export Folder')
      .setDesc('Folder path in your vault where session Markdown reports are saved.')
      .addText(text => text
        .setValue(this.plugin.settings.exportFolder)
        .onChange(async (value) => {
          this.plugin.settings.exportFolder = value.trim();
          await this.plugin.saveSettings();
        }));
  }
}

class GamifiedWritingPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.sessionActive = false;
    this.sessionStartTime = 0;
    this.sessionStartWords = 0;
    this.sessionStartChars = 0;
    this.sessionWordsAdded = 0;
    this.sessionWordsRemoved = 0;
    this.sessionCharsAdded = 0;
    this.lastKeystrokeTime = 0;
    this.pauseThresholdMs = 4000;
    this.sessionPauses = 0;
    this.activeSessionFile = null;
    this.pollInterval = null;

    this.registerView(
      VIEW_TYPE_GAMIFIED_WRITING,
      (leaf) => (this.sidebarView = new GamifiedSidebarView(leaf, this))
    );

    this.addRibbonIcon('gamepad', 'Gamified Writing Suite', () => {
      this.activateView();
    });

    this.addSettingTab(new GamifiedWritingSettingTab(this.app, this));

    this.checkStreak();
  }

  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
  }

  async saveSettings() {
    const cleanSettings = JSON.parse(JSON.stringify(this.settings));
    await this.saveData(cleanSettings);
    if (this.sidebarView) {
      this.sidebarView.updateView();
    }
  }

  activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_GAMIFIED_WRITING)[0];
    if (!leaf) {
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        return rightLeaf.setViewState({
          type: VIEW_TYPE_GAMIFIED_WRITING,
          active: true,
        }).then(() => {
          if (rightLeaf) workspace.revealLeaf(rightLeaf);
        });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  getCurrentTier() {
    const level = this.settings.level;
    if (level <= 300) return 1;
    if (level <= 600) return 2;
    return 3;
  }

  getActiveItemList() {
    const tier = this.getCurrentTier();
    const mode = this.settings.themeMode;

    if (tier === 1) return mode === 'crops' ? TIER_1_CROPS : TIER_1_MONSTERS;
    if (tier === 2) return mode === 'crops' ? TIER_2_CROPS : TIER_2_MONSTERS;
    return mode === 'crops' ? TIER_3_ANIMALS : TIER_3_MONSTERS;
  }

  getOpenMarkdownEditor() {
    try {
      const leaves = this.app.workspace.getLeavesOfType('markdown');
      for (let leaf of leaves) {
        if (leaf.view && leaf.view instanceof MarkdownView && leaf.view.editor) {
          return leaf.view;
        }
      }
    } catch (e) {}
    return null;
  }

  async startSession() {
    const markdownView = this.getOpenMarkdownEditor();

    if (!markdownView || !markdownView.editor) {
      new Notice("No active note found on screen! Please open a note tab first.");
      return;
    }

    this.activeSessionFile = markdownView.file;
    const currentText = markdownView.editor.getValue();

    this.sessionActive = true;
    this.sessionStartTime = Date.now();
    this.sessionStartWords = this.countWords(currentText);
    this.sessionStartChars = currentText.length;
    this.sessionWordsAdded = 0;
    this.sessionWordsRemoved = 0;
    this.sessionCharsAdded = 0;
    this.sessionPauses = 0;
    this.lastKeystrokeTime = Date.now();

    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.pollEditorUpdates();
    }, 500);

    const docName = this.activeSessionFile ? this.activeSessionFile.basename : 'Open Note';
    new Notice(`Session Started on "${docName}"!`);

    if (this.sidebarView) this.sidebarView.updateView();
  }

  pollEditorUpdates() {
    if (!this.sessionActive) return;

    const markdownView = this.getOpenMarkdownEditor();
    if (!markdownView || !markdownView.editor) return;

    const currentText = markdownView.editor.getValue();
    const currentWords = this.countWords(currentText);
    const currentCharCount = currentText.length;

    const totalWordsAdded = Math.max(0, currentWords - this.sessionStartWords);
    const totalWordsRemoved = Math.max(0, this.sessionStartWords - currentWords);

    let updated = false;

    if (this.sessionWordsAdded !== totalWordsAdded) {
      this.sessionWordsAdded = totalWordsAdded;
      this.lastKeystrokeTime = Date.now();
      updated = true;
    }

    if (this.sessionWordsRemoved !== totalWordsRemoved) {
      this.sessionWordsRemoved = totalWordsRemoved;
      updated = true;
    }

    const currentCharsAdded = Math.max(0, currentCharCount - this.sessionStartChars);
    if (this.sessionCharsAdded !== currentCharsAdded) {
      this.sessionCharsAdded = currentCharsAdded;
      updated = true;
    }

    if (Date.now() - this.lastKeystrokeTime > this.pauseThresholdMs && this.sessionWordsAdded > 0) {
      this.sessionPauses++;
      this.lastKeystrokeTime = Date.now();
      updated = true;
    }

    if (updated && this.sidebarView) {
      this.sidebarView.updateView();
    }
  }

  async stopSession() {
    if (!this.sessionActive) return;

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    const durationMinutes = Math.max(1, Math.round((Date.now() - this.sessionStartTime) / 60000));
    const netWords = Math.max(0, this.sessionWordsAdded - this.sessionWordsRemoved);
    const wpm = Math.round(netWords / durationMinutes);

    let harvestedName = 'None';
    const activeList = this.getActiveItemList();
    const sorted = [...activeList].sort((a, b) => b.targetWords - a.targetWords);
    const matched = sorted.find(i => netWords >= i.targetWords);

    if (matched) {
      harvestedName = matched.name;
      this.settings.harvestedItems[matched.name] = (this.settings.harvestedItems[matched.name] || 0) + 1;
    }

    const xpEarned = netWords;
    this.addXP(xpEarned);

    const log = {
      timestamp: new Date().toLocaleString(),
      fileName: this.activeSessionFile ? this.activeSessionFile.basename : 'Untitled',
      durationMinutes,
      wordsWritten: this.sessionWordsAdded,
      charactersWritten: this.sessionCharsAdded,
      wordsRemoved: this.sessionWordsRemoved,
      wpm,
      pausesCount: this.sessionPauses,
      targetGoal: this.settings.globalTargetGoal,
      mode: this.settings.themeMode,
      tier: this.getCurrentTier(),
      harvestedItem: harvestedName,
      dailyEnergy: this.settings.dailyEnergy,
      cyclePhase: this.settings.cyclePhase
    };

    this.settings.sessionLogs.unshift(log);
    this.sessionActive = false;
    this.checkStreak();
    await this.saveSettings();

    await this.exportLogToFolder(log);

    new Notice(`Session Completed! +${xpEarned} XP. Claimed: ${harvestedName}`);
  }

  async exportLogToFolder(log) {
    const folderPath = this.settings.exportFolder || 'Writing Logs';
    
    let folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!folder) {
      await this.app.vault.createFolder(folderPath);
    }

    const logFileName = `${folderPath}/Writing_Log_${new Date().toISOString().split('T')[0]}.md`;
    const logContent = `### Writing Session - ${log.timestamp}
- **Document:** ${log.fileName}
- **Duration:** ${log.durationMinutes} minutes
- **Words Added:** +${log.wordsWritten}
- **Words Removed:** -${log.wordsRemoved}
- **Net Speed:** ${log.wpm} WPM
- **Pauses Detected:** ${log.pausesCount}
- **Reward Claimed:** ${log.harvestedItem} (Tier ${log.tier} ${log.mode.toUpperCase()})
- **Daily Energy:** ${'★'.repeat(log.dailyEnergy)} | **Cycle Phase:** ${log.cyclePhase}

---
`;

    let existingFile = this.app.vault.getAbstractFileByPath(logFileName);
    if (existingFile) {
      const existingContent = await this.app.vault.read(existingFile);
      await this.app.vault.modify(existingFile, logContent + "\n" + existingContent);
    } else {
      await this.app.vault.create(logFileName, `# Daily Writing Session Logs\n\n` + logContent);
    }
  }

  addXP(amount) {
    const oldLevel = this.settings.level;
    this.settings.totalXP += amount;

    let rawLevel = Math.floor(this.settings.totalXP / 250) + 1;
    let newLevel = ((rawLevel - 1) % 900) + 1;

    // Milestone Check: Reaching Level 300
    if (oldLevel < 300 && newLevel >= 300 && newLevel < 600) {
      this.settings.authorStatus = 'Amateur Author';
      new Notice(`🎉 MILESTONE UNLOCKED!\nUnlocked: Amateur Author Status & Tier 2 Roster!`, 10000);
    }
    // Milestone Check: Reaching Level 600
    else if (oldLevel < 600 && newLevel >= 600 && newLevel < 900) {
      this.settings.authorStatus = 'Professional Author';
      new Notice(`🌟 MILESTONE UNLOCKED!\nUnlocked: Professional Author Status & Tier 3 Roster!`, 10000);
    }
    // Milestone Check: Reaching Level 900 (Completion & Loop)
    else if (oldLevel < 900 && (rawLevel > 900 || (oldLevel > newLevel && newLevel === 1))) {
      this.settings.prestigeLoopCount += 1;
      this.settings.authorStatus = 'Novice Writer';
      new Notice(`👑 LEGENDARY COMPLETION!\nYou completed the 900-Level Cycle!\nStarting Legendary Loop #${this.settings.prestigeLoopCount}...`, 12000);
    }

    this.settings.level = newLevel;
  }

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.settings.lastActiveDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (this.settings.lastActiveDate === yesterday) {
      this.settings.currentStreak += 1;
    } else if (this.settings.lastActiveDate !== '') {
      this.settings.currentStreak = 1;
    } else {
      this.settings.currentStreak = 1;
    }

    this.settings.lastActiveDate = today;
    this.saveSettings();
  }

  countWords(str) {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  }
}

module.exports = GamifiedWritingPlugin;