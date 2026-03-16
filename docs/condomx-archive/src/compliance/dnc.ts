/**
 * Do Not Call (DNC) Scrub Integration
 * Handles checking phone numbers against local and national DNC registries.
 */

export interface DNCResult {
  phoneNumber: string;
  isDNC: boolean;
  reason?: string;
  checkedAt: Date;
}

export class DNCScrubber {
  // Local mocked database for DNC list
  private localDNCList: Set<string> = new Set();

  /**
   * Adds a number to the local DNC list.
   */
  public async addToLocalDNC(phoneNumber: string, _reason: string = 'User Opt-Out'): Promise<void> {
    const normalizedNumber = this.normalizeNumber(phoneNumber);
    this.localDNCList.add(normalizedNumber);
    // In a real implementation, this would write to the database and audit log
  }

  /**
   * Removes a number from the local DNC list.
   */
  public async removeFromLocalDNC(phoneNumber: string): Promise<void> {
    const normalizedNumber = this.normalizeNumber(phoneNumber);
    this.localDNCList.delete(normalizedNumber);
  }

  /**
   * Checks if a phone number is on the DNC list.
   * Performs both local and (simulated) external registry checks.
   */
  public async scrubNumber(phoneNumber: string): Promise<DNCResult> {
    const normalizedNumber = this.normalizeNumber(phoneNumber);
    const checkedAt = new Date();

    // 1. Check local opt-out / DNC list
    if (this.localDNCList.has(normalizedNumber)) {
      return {
        phoneNumber: normalizedNumber,
        isDNC: true,
        reason: 'Local DNC Database Match',
        checkedAt,
      };
    }

    // 2. Simulated external registry check (e.g., National DNC Registry, state registries)
    // In production, this would make an API call to a compliance service like dnc.com
    const externalCheckResult = await this.mockExternalRegistryCheck(normalizedNumber);
    if (externalCheckResult.isDNC) {
      return {
        phoneNumber: normalizedNumber,
        isDNC: true,
        reason: 'External Registry Match (Simulated)',
        checkedAt,
      };
    }

    // Number is clear to call
    return {
      phoneNumber: normalizedNumber,
      isDNC: false,
      checkedAt,
    };
  }

  /**
   * Validates multiple numbers in batch.
   */
  public async scrubBatch(phoneNumbers: string[]): Promise<DNCResult[]> {
    return Promise.all(phoneNumbers.map(num => this.scrubNumber(num)));
  }

  /**
   * Normalizes phone numbers to standard E.164 format (simplified for testing).
   */
  private normalizeNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // If it's a 10-digit US number, prepend '1'
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`;
    }
    return phoneNumber.startsWith('+') ? phoneNumber : `+${digitsOnly}`;
  }

  /**
   * Mock external DNC check.
   */
  private async mockExternalRegistryCheck(_phoneNumber: string): Promise<{ isDNC: boolean }> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Simulated logic: ends with '9999' is considered DNC for testing
    return {
      isDNC: _phoneNumber.endsWith('9999'),
    };
  }
}

// Singleton instance for the application
export const dncScrubber = new DNCScrubber();
