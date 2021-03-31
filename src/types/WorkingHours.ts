type startEnd = {
  start: string;
  end: string;
};

type day = {
  isActive: boolean;
  shifts: startEnd[];
};

type WorkingHours = {
  monday: day;
  tuesday: day;
  wednesday: day;
  thursday: day;
  friday: day;
  saturday: day;
  sunday: day;
};

export default WorkingHours;
