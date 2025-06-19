import { onClientCallback } from '@communityox/ox_lib/server';
import { oxmysql as MySQL } from '@communityox/oxmysql';

onClientCallback('rk_experimental:submitReport', async (playerId, yourName: string, phoneNumber: string, incidentDescription: string) => {
  try {
    await MySQL.insert('INSERT INTO reports (your_name, phone_number, incident_description) VALUES (?, ?, ?)', [
      yourName,
      phoneNumber,
      incidentDescription
    ]);
    
    return {
      success: true,
      message: 'Report submitted successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to submit report'
    };
  }
});

onClientCallback('rk_experimental:getReports', async (playerId) => {
  try {
    // Check if player has police permission
    if (!IsPlayerAceAllowed(playerId, 'police.reports')) {
      return null;
    }

    const reports = await MySQL.query('SELECT * FROM reports ORDER BY created_at DESC');
    return reports;
  } catch (error) {
    return null;
  }
});

onClientCallback('rk_experimental:deleteReport', async (playerId, reportId: number) => {
  try {
    // Check if player has police permission
    if (!IsPlayerAceAllowed(playerId, 'police.reports')) {
      return { success: false, message: 'No permission' };
    }

    await MySQL.query('DELETE FROM reports WHERE id = ?', [reportId]);
    
    return {
      success: true,
      message: 'Report deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete report'
    };
  }
});
