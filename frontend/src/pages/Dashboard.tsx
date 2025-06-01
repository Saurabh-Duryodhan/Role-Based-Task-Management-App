import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiUsers,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
import type { Task, TaskStatus } from '../types';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

interface TaskStatusCount {
  status: TaskStatus;
  count: number;
  color: string;
  icon: React.ReactNode;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<TaskStatusCount[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated API call - Replace with actual API call
    const fetchDashboardData = async () => {
      try {
        // Simulated data
        const mockStats: StatCard[] = [
          {
            title: 'Total Tasks',
            value: 24,
            icon: <FiCheckCircle className="w-6 h-6" />,
            color: 'bg-blue-500',
            change: '+12%'
          },
          {
            title: 'Pending Tasks',
            value: 8,
            icon: <FiClock className="w-6 h-6" />,
            color: 'bg-yellow-500',
            change: '-3%'
          },
          {
            title: 'Overdue Tasks',
            value: 3,
            icon: <FiAlertCircle className="w-6 h-6" />,
            color: 'bg-red-500',
            change: '+2%'
          },
          {
            title: 'Team Members',
            value: user?.role === 'admin' ? 12 : 8,
            icon: <FiUsers className="w-6 h-6" />,
            color: 'bg-green-500',
            change: '+1'
          }
        ];

        const mockTaskStatuses: TaskStatusCount[] = [
          { status: 'todo', count: 8, color: 'bg-gray-500', icon: <FiClock className="w-5 h-5" /> },
          { status: 'in_progress', count: 6, color: 'bg-blue-500', icon: <FiTrendingUp className="w-5 h-5" /> },
          { status: 'review', count: 4, color: 'bg-yellow-500', icon: <FiAlertCircle className="w-5 h-5" /> },
          { status: 'done', count: 6, color: 'bg-green-500', icon: <FiCheckCircle className="w-5 h-5" /> }
        ];

        const mockRecentTasks: Task[] = [
          {
            id: '1',
            title: 'Implement user authentication',
            description: 'Set up JWT authentication',
            status: 'in_progress',
            priority: 'high',
            dueDate: '2024-03-20',
            assignedTo: 'John Doe',
            createdBy: 'Admin',
            createdAt: '2024-03-15',
            updatedAt: '2024-03-15'
          },
          // Add more mock tasks as needed
        ];

        setStats(mockStats);
        setTaskStatuses(mockTaskStatuses);
        setRecentTasks(mockRecentTasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      {stat.change && (
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Status Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Task Status Overview
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {taskStatuses.map((status, index) => (
              <motion.div
                key={status.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
              >
                <div className={`flex-shrink-0 rounded-md p-2 ${status.color}`}>
                  <div className="text-white">{status.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {status.status.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {status.count} tasks
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tasks
            </h3>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View All
            </button>
          </div>
          <div className="mt-5">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FiCalendar className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 