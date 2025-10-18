// Animation Manager - Coordinates all gem animations and effects

export interface AnimationState {
  type: 'normal' | 'disappearing' | 'falling' | 'appearing' | 'landing';
  delay?: number;
}

export interface MatchAnimation {
  positions: Array<{ row: number; col: number }>;
  startTime: number;
  duration: number;
}

export class AnimationManager {
  private activeMatches: MatchAnimation[] = [];
  private animationCallbacks: Map<string, () => void> = new Map();

  // Start match disappearing animation with sparkles
  startMatchAnimation(matches: Set<string>, onComplete: () => void): void {
    const positions = Array.from(matches).map(matchKey => {
      const parts = matchKey.split('-');
      const row = parseInt(parts[0] || '0', 10);
      const col = parseInt(parts[1] || '0', 10);
      return { row, col };
    });

    const matchAnimation: MatchAnimation = {
      positions,
      startTime: Date.now(),
      duration: 500 // 0.5 seconds
    };

    this.activeMatches.push(matchAnimation);

    // Set up completion callback
    const callbackId = `match-${Date.now()}`;
    this.animationCallbacks.set(callbackId, onComplete);

    // Clean up after animation completes
    setTimeout(() => {
      this.activeMatches = this.activeMatches.filter(anim => anim !== matchAnimation);
      const callback = this.animationCallbacks.get(callbackId);
      if (callback) {
        callback();
        this.animationCallbacks.delete(callbackId);
      }
    }, matchAnimation.duration);
  }

  // Start gravity falling animation for new gems
  startGravityAnimation(newGemPositions: Array<{ row: number; col: number }>, onComplete: () => void): void {
    const maxDelay = Math.max(...newGemPositions.map(pos => pos.row * 100)); // Stagger based on row
    const totalDuration = 600 + maxDelay; // Base animation + stagger delay

    const callbackId = `gravity-${Date.now()}`;
    this.animationCallbacks.set(callbackId, onComplete);

    setTimeout(() => {
      const callback = this.animationCallbacks.get(callbackId);
      if (callback) {
        callback();
        this.animationCallbacks.delete(callbackId);
      }
    }, totalDuration);
  }

  // Get current active match positions for rendering sparkles
  getActiveMatchPositions(): Array<{ row: number; col: number }> {
    const now = Date.now();
    return this.activeMatches
      .filter(match => now - match.startTime < match.duration)
      .flatMap(match => match.positions);
  }

  // Calculate animation state for a gem based on its properties
  getGemAnimationState(gem: { row: number; col: number; isNew?: boolean; isMatched?: boolean }): AnimationState {
    if (gem.isMatched) {
      return { type: 'disappearing' };
    }
    
    if (gem.isNew) {
      // Stagger new gems based on their row (higher rows fall first)
      const delay = gem.row * 100; // 100ms delay per row
      return { type: 'falling', delay };
    }

    return { type: 'normal' };
  }

  // Generate CSS classes for a gem based on its animation state
  getGemClasses(animationState: AnimationState): string {
    const classes = ['gem'];
    
    switch (animationState.type) {
      case 'disappearing':
        classes.push('gem-disappearing');
        break;
      case 'falling':
        classes.push('gem-falling');
        if (animationState.delay) {
          const delayIndex = Math.min(Math.floor(animationState.delay / 100), 5);
          classes.push(`gem-cascade-delay-${delayIndex}`);
        }
        break;
      case 'appearing':
        classes.push('gem-appearing');
        break;
      case 'landing':
        classes.push('gem-landing');
        break;
    }

    return classes.join(' ');
  }

  // Clear all active animations (useful for board reset)
  clearAllAnimations(): void {
    this.activeMatches = [];
    this.animationCallbacks.clear();
  }
}

// Singleton instance
export const animationManager = new AnimationManager();