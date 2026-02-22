
import React, { useState, useEffect } from 'react';
import { Course, CourseLevel, CourseStatus, LearningPath } from '../types';
import { Search, Plus, ExternalLink, Filter, CheckCircle2 } from 'lucide-react';
import { DEFAULT_COURSES } from '../src/constants';

const CourseLibrary: React.FC<{ path: LearningPath | null, setPath: (p: LearningPath) => void }> = ({ path, setPath }) => {
  const [masterCourses, setMasterCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    source: 'User Upload',
    level: CourseLevel.BASIC,
    durationHours: 2,
    description: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('we_rise_admin_courses');
    if (saved) {
      setMasterCourses(JSON.parse(saved));
    } else {
      setMasterCourses(DEFAULT_COURSES);
      localStorage.setItem('we_rise_admin_courses', JSON.stringify(DEFAULT_COURSES));
    }
  }, []);

  const handleAddCourse = () => {
    if (!path || !newCourse.title) return;

    const course: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: newCourse.title || '',
      source: newCourse.source || 'Manual',
      level: newCourse.level || CourseLevel.BASIC,
      category: 'User Added',
      durationHours: newCourse.durationHours || 0,
      status: CourseStatus.NOT_STARTED,
      progress: 0,
      description: newCourse.description || ''
    };

    setPath({
      ...path,
      courses: [...path.courses, course],
      overallProgress: path.overallProgress,
      lastUpdated: new Date().toISOString(),
      id: path.id,
      title: path.title
    });
    setShowAddModal(false);
  };

  const addToRoadmap = (course: Course) => {
    if (!path) return;
    if (path.courses.some(c => c.id === course.id)) return;

    setPath({
      ...path,
      courses: [...path.courses, { ...course, status: CourseStatus.NOT_STARTED, progress: 0 }],
      overallProgress: path.overallProgress,
      lastUpdated: new Date().toISOString(),
      id: path.id,
      title: path.title
    });
  };

  const filteredCourses = masterCourses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[12px] font-bold">Course Library</h1>
          <p className="text-slate-500">Explore curated and community-driven content for POs.</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Personal Course
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses, skills, or platforms..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isInRoadmap = path?.courses.some(c => c.id === course.id);
          return (
            <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-50 text-slate-400 rounded-md">{course.category}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">{course.source}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.description}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      {course.level} • {course.durationHours}h
                  </div>
                  <div className="flex gap-2">
                    {course.url && (
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {path && (
                      <button 
                        onClick={() => addToRoadmap(course)}
                        disabled={isInRoadmap}
                        className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                          isInRoadmap 
                            ? 'bg-emerald-50 text-emerald-600 cursor-default' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        {isInRoadmap ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                        <span className="text-[10px] font-bold uppercase">{isInRoadmap ? 'Added' : 'Add'}</span>
                      </button>
                    )}
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-bold mb-6">Add Custom Course</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Course Title</label>
                        <input 
                          type="text" 
                          className="w-full p-3 mt-1 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                          placeholder="e.g., Advanced SQL for POs"
                          value={newCourse.title}
                          onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Source (URL or Platform)</label>
                        <input 
                          type="text" 
                          className="w-full p-3 mt-1 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                          placeholder="e.g., Coursera"
                          value={newCourse.source}
                          onChange={e => setNewCourse({...newCourse, source: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Level</label>
                            <select 
                                className="w-full p-3 mt-1 rounded-xl border border-slate-200 outline-none bg-white"
                                value={newCourse.level}
                                onChange={e => setNewCourse({...newCourse, level: e.target.value as CourseLevel})}
                            >
                                <option value={CourseLevel.BASIC}>Basic</option>
                                <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                                <option value={CourseLevel.ADVANCED}>Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Hours</label>
                            <input 
                                type="number" 
                                className="w-full p-3 mt-1 rounded-xl border border-slate-200 outline-none" 
                                value={newCourse.durationHours}
                                onChange={e => setNewCourse({...newCourse, durationHours: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Description</label>
                        <textarea 
                          className="w-full p-3 mt-1 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                          value={newCourse.description}
                          onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleAddCourse} className="flex-1 py-3 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Add to Path</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CourseLibrary;
