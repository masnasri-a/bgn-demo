import { useState, useEffect } from 'react';

interface ApiUser {
  id: number;
  name: string;
  phone: string;
  location_id: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  page: number;
  limit: number;
  total: number;
  total_page: number;
  data: ApiUser[];
}

interface TableUser {
  id: number;
  user: {
    image: string;
    name: string;
    phone: string;
    location_id: string;
  };
}

interface CreateUserData {
  name: string;
  phone: string;
  location_id: string;
}

interface UpdateUserData {
  name: string;
  phone: string;
  location_id: string;
}

// Helper function to generate random user image
const getRandomUserImage = (): string => {
  const randomNum = Math.floor(Math.random() * 24) + 1;
  const paddedNum = randomNum.toString().padStart(2, '0');
  return `/images/user/user-${paddedNum}.jpg`;
};

// Transform API data to table format
const transformApiDataToTableData = (apiData: ApiUser[]): TableUser[] => {
  return apiData.map((user) => {
    return {
      id: user.id,
      user: {
        image: getRandomUserImage(),
        name: user.name,
        phone: user.phone,
        location_id: user.location_id,
      },
    };
  });
};

export const useUsersData = () => {
  const [data, setData] = useState<TableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://bgn-be.anakanjeng.site/users/list?page=1&limit=10');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      const transformedData = transformApiDataToTableData(result.data);
      
      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: CreateUserData) => {
    try {
      const response = await fetch('https://bgn-be.anakanjeng.site/users/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error creating user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const getUserById = async (userId: number): Promise<{ success: boolean; data?: ApiUser; error?: string }> => {
    try {
      const response = await fetch(`https://bgn-be.anakanjeng.site/users/select/?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiUser = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateUser = async (userId: number, userData: UpdateUserData) => {
    try {
      const response = await fetch(`https://bgn-be.anakanjeng.site/users/update/?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error updating user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`https://bgn-be.anakanjeng.site/users/delete/?user_id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return { 
    data, 
    loading, 
    error, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser,
    refreshUsers: fetchUsers 
  };
};