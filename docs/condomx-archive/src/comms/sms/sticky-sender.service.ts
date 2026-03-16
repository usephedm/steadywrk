/**
 * Sticky Sender Service
 * 
 * Implements ADR-004: Custom Sticky Sender logic (20 lines of code)
 * Maps technician phone -> our phone number for persona consistency
 * 
 * "Hey Marcus, it's Randy from FixIt Repairs" - always same number
 */

import type { Account, Technician } from '../../types/index.js';

export interface StickySenderConfig {
  // Map of technician phone -> assigned account number
  assignments: Map<string, string>;
  // Default number for unassigned technicians
  defaultNumber: string;
}

export class StickySenderService {
  private config: StickySenderConfig;

  constructor(config: StickySenderConfig) {
    this.config = config;
  }

  /**
   * Get assigned phone number for a technician
   * 
   * @param technician - Technician to get number for
   * @param account - Account with available numbers
   * @returns Phone number to use ( Sticky Sender )
   */
  getNumberForTechnician(
    technician: Technician,
    account: Account
  ): string {
    // Check if technician has an assigned number
    const assigned = this.config.assignments.get(technician.phone);
    if (assigned && account.phone_numbers.includes(assigned)) {
      return assigned;
    }

    // First contact: assign first available number from account
    const availableNumber = account.phone_numbers[0] || this.config.defaultNumber;
    
    // Persist assignment
    this.config.assignments.set(technician.phone, availableNumber);
    
    return availableNumber;
  }

  /**
   * Assign specific number to technician
   * 
   * @param technicianPhone - Technician's phone
   * @param accountNumber - Account number to assign
   */
  assignNumber(technicianPhone: string, accountNumber: string) {
    this.config.assignments.set(technicianPhone, accountNumber);
  }

  /**
   * Clear assignment (technician opt-out, account change, etc.)
   * 
   * @param technicianPhone - Technician's phone
   */
  clearAssignment(technicianPhone: string) {
    this.config.assignments.delete(technicianPhone);
  }

  /**
   * Get all assignments (for debugging/admin)
   */
  getAllAssignments(): Map<string, string> {
    return new Map(this.config.assignments);
  }

  /**
   * Bulk assign numbers for new account setup
   * 
   * @param technicians - List of technicians
   * @param account - Account with phone numbers
   */
  bulkAssign(technicians: Technician[], account: Account) {
    technicians.forEach((tech, index) => {
      const numberIndex = index % account.phone_numbers.length;
      const number = account.phone_numbers[numberIndex]!;
      this.assignNumber(tech.phone, number);
    });
  }
}
