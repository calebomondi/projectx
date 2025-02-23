import axios, {AxiosResponse} from 'axios';
import { API_URL } from './apiurl';
import { Send2DB, Lock, VaultData, ScheduledData, UpdateToLock, DeleteLock, DashboardData } from '@/types';
import { getWalletClient } from '@/blockchain-services/useFvkry';

const apiService = {
    lockAsset: async (formData:Send2DB): Promise<any> => {
        const { address } = await getWalletClient();
        
        try {
          const response: AxiosResponse<any> = await axios.post(
            `${API_URL}/api/write/lockAsset`,
            {
              address,
              lockData: formData
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
    
          return response.data;
          
        } catch (error) {
          console.error('Asset Locking Failed:', error);
          throw error;
        }
    },
    getCombinedVaultData: async (vaultData:Lock[]): Promise<VaultData[]> => {
      const { address } = await getWalletClient();

      // Convert the vaultData to make it JSON-serializable
      const serializedVaultData = vaultData.map(vault => ({
        ...vault,
        // Convert BigInt to string
        amount: vault.amount.toString(),
        // Convert other BigInt fields if they exist
        lockEndTime: vault.lockEndTime.toString()
      }));
      
      try {
        const response: AxiosResponse<VaultData[]> = await axios.post(
          `${API_URL}/api/utils/combine`,
          {
            address,
            bcData: serializedVaultData
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        return response.data;
        
      } catch (error) {
        console.error('Asset Locking Failed:', error);
        throw error;
      }
    },
    addSchedule: async (scheduledData:ScheduledData): Promise<{status: boolean}> => {
      try {
        const response: AxiosResponse<{status: boolean}> = await axios.post(
          `${API_URL}/api/write/lockSchedule`,
          {
            scheduleData: scheduledData
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        return response.data;
        
      } catch (error) {
        console.error('Setting Unlock Schedule Failed:', error);
        throw error;
      }
    },
    updateLock: async (update:UpdateToLock): Promise<{status: boolean}> => {
      const { address } = await getWalletClient();

      try {
        const response: AxiosResponse<{status: boolean}> = await axios.post(
          `${API_URL}/api/write/updateLock`,
          {
            address,
            newData: update
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        return response.data;
        
      } catch (error) {
        console.error('Setting Unlock Schedule Failed:', error);
        throw error;
      }
    },
    deleteLock: async (lock:DeleteLock): Promise<{status: boolean}> => {
      const { address } = await getWalletClient();

      try {
        const response: AxiosResponse<{status: boolean}> = await axios.post(
          `${API_URL}/api/write/deleteLock`,
          {
            address,
            vault: lock
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        return response.data;
        
      } catch (error) {
        console.error('Setting Unlock Schedule Failed:', error);
        throw error;
      }
    },
    analysis: async (): Promise<DashboardData> => {
      const { address } = await getWalletClient();

      try {
        const response: AxiosResponse<DashboardData> = await axios.get(
          `${API_URL}/api/read/dashboard/analysis`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            params: {
              userAddress: address
            }
          }
        );
  
        return response.data;
        
      } catch (error) {
        console.error('Getting Data Failed:', error);
        throw error;
      }
    }
}

export default apiService;