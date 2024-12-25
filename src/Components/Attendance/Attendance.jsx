import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [markedDates, setMarkedDates] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    fullDay: 0,
    halfDay: 0,
    leave: 0,
    total: 0,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [targetLocation, setTargetLocation] = useState({
    lat: 28.686328344888768,  // Example latitude (Bangalore, India)
    lng: 77.3365892262804, // Example longitude
  });

  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();
  const today = dayjs().format("YYYY/MM/DD");
  const currentTime = dayjs().format("HH:mm");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const formattedMonth = currentDate.format("YYYY-MM");
        const response = await axios.get(
          `https://management-system-jet.vercel.app/api/attendance/getAttendance/${userId}/${formattedMonth}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data.attendanceRecords || [];
        setMarkedDates(data);
        calculateStats(data);
      } catch (error) {
        toast.error("Failed to fetch attendance data.");
      }
    };
    fetchAttendance();
  }, [currentDate, userId, token]);

  // Calculate stats
  const calculateStats = (data) => {
    const stats = { fullDay: 0, halfDay: 0, leave: 0, total: 0 };
    data.forEach((entry) => stats[entry.type]++);
    stats.total = stats.fullDay + stats.halfDay;
    setAttendanceStats(stats);
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
        },
        () => {
          toast.error("Failed to retrieve location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (deg) => deg * (Math.PI / 180);
    const earthRadius = 6371e3; // Earth radius in meters

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c; // Distance in meters
  };

  const markAttendance = async (type) => {
    try {
      const response = await axios.post(
        "https://management-system-jet.vercel.app/api/attendance/markAttendance",
        { date: today, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setMarkedDates([...markedDates, { date: today, type }]);
        updateStats(type);
        toast.success(`Attendance marked as ${type}`);
      }
    } catch {
      toast.error("Failed to mark attendance.");
    }
  };

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    if (!userLocation || !targetLocation) {
      return toast.error("Unable to determine your location.");
    }

    // Debugging log for location
    console.log("User Location:", userLocation);
    console.log("Target Location:", targetLocation);

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      targetLocation.lat,
      targetLocation.lng
    );

    console.log("Distance between user and target:", distance, "meters");

    // Check if the distance is within 30 meters
    if (distance > 30) {
      return toast.error("You are outside the 30-meter radius.");
    }

    if (markedDates.some((entry) => entry.date === today)) {
      return toast.error("Attendance already marked for today.");
    }

    let type = "leave";
    if (currentTime >= "08:50" && currentTime <= "09:10") type = "fullDay";
    else if (currentTime > "09:10" && currentTime <= "14:30") type = "halfDay";

    markAttendance(type);
  };

  const updateStats = (type) => {
    setAttendanceStats((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
      total: prev.total + 1,
    }));
  };

  // Memoized calendar data
  const calendarDays = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = currentDate.startOf("month").add(i, "day");
      const formattedDate = date.format("YYYY/MM/DD");
      const markedDate = markedDates.find(
        (entry) => entry.date === formattedDate
      );
      return { date, markedDate };
    });
  }, [currentDate, markedDates]);

  return (
    <div className="p-1 min-h-screen">
      <Toaster />
      <div className="flex flex-wrap justify-evenly gap-4 mb-6">
        {["Full Day", "Half Day", "Leave", "Total Attendance"].map(
          (item, index) => {
            const statKey = ["fullDay", "halfDay", "leave", "total"][index];
            const bgColors = [
              "bg-green-300",
              "bg-yellow-300",
              "bg-red-300",
              "bg-blue-300",
            ];
            const textColors = [
              "text-green-600",
              "text-yellow-600",
              "text-red-600",
              "text-blue-600",
            ];

            return (
              <div
                key={item}
                className={`h-36 w-60 max-sm:w-full rounded-md shadow-md flex flex-col items-center justify-center ${bgColors[index]}`}
              >
                <h2
                  className={`text-2xl font-bold ${textColors[index]} text-center`}
                >
                  {item}
                </h2>
                <p
                  className={`text-3xl font-bold ${textColors[index]} text-center`}
                >
                  {attendanceStats[statKey]}
                </p>
              </div>
            );
          }
        )}
      </div>

      <div className="flex max-md:flex-wrap gap-5">
        <div className="flex-1 bg-slate-100 p-6 rounded shadow-md w-2/3 max-md:w-full">
          <form onSubmit={handleMarkAttendance}>
            <input
              type="text"
              className="border-2 rounded-xl px-4 py-3 w-full bg-white"
              disabled
              value={today}
            />
            <div className="flex justify-center">
              <button className="bg-green-500 text-white px-4 py-2 mt-2 mb-2 rounded">
                Mark Attendance
              </button>
            </div>
          </form>

          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: startDay }, (_, i) => (
              <div key={`empty-${i}`} className="h-10"></div>
            ))}
            {calendarDays.map(({ date, markedDate }, i) => {
              let bgColor = "bg-gray-200";
              if (markedDate?.type === "fullDay")
                bgColor = "bg-green-500 text-white";
              if (markedDate?.type === "halfDay")
                bgColor = "bg-yellow-500 text-white";
              if (markedDate?.type === "leave")
                bgColor = "bg-red-500 text-white";

              return (
                <div
                  key={i}
                  className={`h-20 max-sm:h-12 flex items-center justify-center rounded ${bgColor}`}
                >
                  {date.date()}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded shadow-md w-1/3 max-md:w-full">
          <h2 className="text-lg font-bold mb-2">Today</h2>
          <p className="text-xl">{dayjs().format("DD MMMM YYYY")}</p>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
