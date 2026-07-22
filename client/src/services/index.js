import API from './api';

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (token, data) => API.put(`/auth/reset-password/${token}`, data),
  updateProfile: (data) => API.put('/auth/update-profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => API.put('/auth/change-password', data),
};

export const courseService = {
  getAll: (params) => API.get('/courses', { params }),
  getOne: (id) => API.get(`/courses/${id}`),
  create: (data) => API.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/courses/${id}`),
  togglePublish: (id) => API.put(`/courses/${id}/publish`),
  getInstructorCourses: () => API.get('/courses/instructor/my-courses'),
  enroll: (id) => API.post(`/courses/${id}/enroll`),
  getEnrolled: () => API.get('/courses/enrolled'),
  updateProgress: (courseId, lessonId) => API.put(`/courses/${courseId}/progress/${lessonId}`),
};

export const lessonService = {
  getAll: (courseId) => API.get(`/lessons/${courseId}`),
  getOne: (id) => API.get(`/lessons/single/${id}`),
  create: (courseId, data) => API.post(`/lessons/${courseId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/lessons/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/lessons/${id}`),
};

export const assignmentService = {
  getAll: (courseId) => API.get(`/assignments/course/${courseId}`),
  getOne: (id) => API.get(`/assignments/${id}`),
  create: (data) => API.post('/assignments', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/assignments/${id}`, data),
  delete: (id) => API.delete(`/assignments/${id}`),
  submit: (id, data) => API.post(`/assignments/${id}/submit`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSubmissions: (id) => API.get(`/assignments/${id}/submissions`),
  grade: (id, data) => API.put(`/assignments/submissions/${id}/grade`, data),
};

export const quizService = {
  getAll: (courseId) => API.get(`/quizzes/course/${courseId}`),
  getOne: (id) => API.get(`/quizzes/${id}`),
  create: (data) => API.post('/quizzes', data),
  update: (id, data) => API.put(`/quizzes/${id}`, data),
  delete: (id) => API.delete(`/quizzes/${id}`),
  submit: (id, data) => API.post(`/quizzes/${id}/submit`, data),
  getLeaderboard: (id) => API.get(`/quizzes/${id}/leaderboard`),
  getMyAttempts: (id) => API.get(`/quizzes/${id}/my-attempts`),
};

export const paymentService = {
  createOrder: (courseId) => API.post(`/payments/create-order/${courseId}`),
  verify: (data) => API.post('/payments/verify', data),
  getHistory: () => API.get('/payments/history'),
  getAll: () => API.get('/payments/all'),
};

export const certificateService = {
  generate: (courseId) => API.post(`/certificates/generate/${courseId}`),
  getMy: () => API.get('/certificates/my-certificates'),
  verify: (certId) => API.get(`/certificates/verify/${certId}`),
  getAll: () => API.get('/certificates/all'),
};

export const reviewService = {
  getAll: (courseId) => API.get(`/reviews/${courseId}`),
  create: (courseId, data) => API.post(`/reviews/${courseId}`, data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const notificationService = {
  getAll: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/mark-all-read'),
  delete: (id) => API.delete(`/notifications/${id}`),
  sendAnnouncement: (data) => API.post('/notifications/announcement', data),
};

export const categoryService = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const adminService = {
  getUsers: (params) => API.get('/admin/users', { params }),
  getUser: (id) => API.get(`/admin/users/${id}`),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  approveInstructor: (id) => API.put(`/admin/approve-instructor/${id}`),
  getDashboard: () => API.get('/admin/dashboard'),
  getInstructorDashboard: () => API.get('/admin/instructor-dashboard'),
  getStudentDashboard: () => API.get('/admin/student-dashboard'),
};
