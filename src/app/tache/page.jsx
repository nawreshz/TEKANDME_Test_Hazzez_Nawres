"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Layout/Footer/Footer";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Header from "../components/Layout/Header/Header";
import styles from "./tache.module.css";
import Carte from "../components/Carte/Carte";
import Image from "next/image";
import CarteStats from "../components/CarteStats/CarteStats";
import CarteAllTask from "../components/CarteAllTask/CarteAllTask";

const api = axios.create({
  baseURL: "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Constants
const PRIORITY_OPTIONS = [
  { value: "low", label: "Basse" },
  { value: "normal", label: "Normale" },
  { value: "urgent", label: "Urgente" },
];

const INITIAL_TASK = {
  title: "",
  description: "",
  start_date: "",
  due_date: "",
  completed: false,
  priority: "normal",
};

// Helper functions
const formatDate = (date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const dayName = days[date.getDay()];
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}, ${months[date.getMonth()]} ${date.getFullYear()}`;
  
  return { dayName, formattedDate };
};

const filterTasks = (tasks, { status, priority, search }) => {
  return tasks.filter(task => {
    const matchesStatus = status === "all" || 
      (status === "completed" ? task.completed : !task.completed);
    
    const matchesPriority = priority === "all" || task.priority === priority;
    
    const matchesSearch = !search || 
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });
};

export default function Tache() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredDateTasks, setFilteredDateTasks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState(INITIAL_TASK);
  const [showModal, setShowModal] = useState(false);
  const [quickInputTitle, setQuickInputTitle] = useState("");
  const [quickInputDetail, setQuickInputDetail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [validationError, setValidationError] = useState("");

  // Get filtered tasks based on current filters
  const filteredTasks = filterTasks(filteredDateTasks || tasks, {
    status: selectedStatus,
    priority: selectedPriority,
    search: searchQuery
  });

  // Date info for display
  const { dayName, formattedDate } = formatDate(new Date());

  // Fetch tasks when user changes
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchTasks();
  }, [user, router]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/users/${user.id}?populate=taches`);
      if (response.data) {
        setTasks(response.data.taches || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate all required fields
    if (!newTask.title.trim()) {
      setValidationError("Le titre est requis");
      return;
    }
    if (!newTask.description.trim()) {
      setValidationError("La description est requise");
      return;
    }
    if (!newTask.start_date) {
      setValidationError("La date de début est requise");
      return;
    }
    if (!newTask.due_date) {
      setValidationError("La date d'échéance est requise");
      return;
    }
    if (!newTask.priority) {
      setValidationError("La priorité est requise");
      return;
    }

    try {
      const response = await api.post("/taches", {
        data: {
          ...newTask,
          publishedAt: new Date().toISOString(),
          user: user.id,
        },
      });

      if (response.data) {
        await fetchTasks();
        setNewTask(INITIAL_TASK);
        setShowModal(false);
        setValidationError("");
      }
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      setValidationError("Une erreur s'est produite lors de la création de la tâche");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await api.put(`/taches/${taskId}`, {
        data: {
          ...updatedData,
          publishedAt: new Date().toISOString(),
        },
      });

      if (response.data) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/taches/${taskId}`);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const response = await api.put(`/taches/${taskId}`, {
        data: {
          completed: !currentStatus,
          publishedAt: new Date().toISOString(),
        },
      });

      if (response.data) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error updating completion:", error.response?.data || error.message);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const selectedDateStr = date.toISOString().split('T')[0];
    
    if (selectedDateStr) {
    
      const tasksForDate = tasks.filter(task => {
        const startDate = new Date(task.start_date);
        const endDate = new Date(task.due_date);
        const selectedDateObj = new Date(selectedDateStr);
        return selectedDateObj >= startDate && selectedDateObj <= endDate;
      });
      setFilteredDateTasks(tasksForDate);
    } else {
      setFilteredDateTasks(null);
    }
  };

  const getTasksCountForDate = (date) => {
    if (!date) return 0;
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const startDate = new Date(task.start_date);
      const endDate = new Date(task.due_date);
      const selectedDateObj = new Date(dateStr);
      return selectedDateObj >= startDate && selectedDateObj <= endDate;
    }).length;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const count = getTasksCountForDate(date);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      let className = '';
      
      if (count > 0) className += ' has-tasks';
      if (isSelected) className += ' selected-date';
      
      return className;
    }
  };

  
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const count = getTasksCountForDate(date);
      return count > 0 ? (
        <div className={styles.taskCount}>
          {count}
        </div>
      ) : null;
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="container">
        <h1 className={`${styles.HelloText}  FontFamilyRobotoFlex `}>
          Hello, {user?.username},
          <span className={`${styles.SpanHelloText}`}>
            {" "}
            Start planning today
          </span>
          
        </h1>

        <div className={`d-flex ${styles.TaskBody} gap-4	`}>
          <div className={`d-flex flex-column ${styles.CalendarAndDate}`}>
            <span className={`${styles.DayName} FontFamilyMoments`}>{dayName}</span>
            <span className={`${styles.FormattedDate} FontFamilyAbhayaLibre text-center`}>
              {formattedDate}
            </span>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="fr-FR"
              className={styles.calendar}
              tileContent={getTileContent}
              tileClassName={getTileClassName}
              minDetail="month"
              maxDetail="month"
              showNeighboringMonth={false}
            />
            {getTasksCountForDate(selectedDate) > 0 && (
              <div className={styles.selectedDateTasks}>
                <h3 className={styles.selectedDateTitle}>
                  Tâches pour le {selectedDate.toLocaleDateString('fr-FR')}
                </h3>
                <div className={styles.tasksList}>
                  {tasks.filter(task => {
                    const startDate = new Date(task.start_date);
                    const endDate = new Date(task.due_date);
                    return selectedDate >= startDate && selectedDate <= endDate;
                  }).map(task => (
                    <div key={task.id} className={styles.dateTaskItem}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={`${styles.taskPriority} ${styles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-100 d-flex flex-column gap-4">
            {/* Creation Task */}
            <span className={`${styles.DayNameMobile} FontFamilyMoments`}>{dayName}</span>
            <div className="d-flex justify-content-between w-100">
              <input
                type="text"
                placeholder="type Title of task"
                className={`${styles.InputCreation} ${styles.InputCreationTitle}`}
                value={quickInputTitle}
                onChange={(e) => setQuickInputTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Detail of your task"
                className={`${styles.InputCreation} ${styles.InputCreationDetail}`}
                value={quickInputDetail}
                onChange={(e) => setQuickInputDetail(e.target.value)}
              />
              <button
                className={`border-0  ${styles.ButtonCreation}`}
                onClick={() => {
                  setNewTask({
                    ...newTask,
                    title: quickInputTitle,
                    description: quickInputDetail,
                  });
                  setShowModal(true);
                  setQuickInputTitle("");
                  setQuickInputDetail("");
                }}
              >
                <Image
                  src="/Icons/Add_Plus.svg"
                  alt="plus"
                  width={20}
                  height={20}
                />
              </button>
            </div>
        
            <div className="d-flex flex-column gap-3">
              <div className={`d-flex justify-content-between w-100 align-items-center ${styles.FiltresParentBody}`}>
                <div className={`d-flex  ${styles.FiltresParent}`}>
                  <div className={`${styles.FiltresBody}`}>
                    <span className={`${styles.titlesFiltres} FontFamilyInter`}>
                      Catégorie
                    </span>
                    <select
                      className="form-select form-select-sm"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">Toutes</option>
                      <option value="completed">Complétées</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>

                  <div className={`${styles.FiltresBody}`}>
                    <span className={`${styles.titlesFiltres} FontFamilyInter`}>
                      Priorité
                    </span>
                    <select
                      className="form-select form-select-sm"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      <option value="all">Toutes</option>
                      <option value="urgent">Urgente</option>
                      <option value="normal">Normale</option>
                      <option value="low">Basse</option>
                    </select>
                  </div>
                </div>
                <div className="position-relative">
                  <input
                    type="search"
                    placeholder="Search by name"
                    className={`${styles.InputSearch} FontFamilyInter regular`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className={`bg-transparent border-0 ${styles.IconSearch}`}
                  >
                    <Image
                      src="/Icons/Search.svg"
                      alt="search"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>
              <div className={`${styles.CarteParent}`}>
              {filteredTasks.map((task) => (
                  <Carte
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    startDate={task.start_date}
                    endDate={task.due_date}
                    priority={task.priority || "normal"}
                    completed={task.completed}
                    onClick1={(taskId, currentStatus) =>
                      toggleTaskCompletion(taskId, currentStatus)
                    }
                    onClick2={(updatedData) =>
                      handleUpdateTask(task.id, updatedData)
                    }
                    onClick3={(taskId) => handleDeleteTask(taskId)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* les taches */}
        </div>
      </div>
      <div
        className={`d-flex justify-content-between w-100 ${styles.CarteStatsParentCarts}`}
      >
        <div className={`${styles.CarteStatsParent}`}>
          <CarteStats
            title="COMPLETED TASKS"
            value={tasks.filter((task) => task.completed).length}
            isCompleted={true}
          />
          <CarteStats
            title="PENDING TASKS"
            value={tasks.filter((task) => !task.completed).length}
            isCompleted={false}
          />
        </div>
        <CarteAllTask nombre={tasks.length} />
      </div>

      <Footer />

      {/* Add Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {validationError && (
                  <div className="alert alert-danger" role="alert">
                    {validationError}
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTask(e);
                    setShowModal(false);
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Titre de la tâche"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Description de la tâche"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newTask.start_date}
                        onChange={(e) =>
                          setNewTask({ ...newTask, start_date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newTask.due_date}
                        onChange={(e) =>
                          setNewTask({ ...newTask, due_date: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="modal-backdrop show"
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </>
  );
}
