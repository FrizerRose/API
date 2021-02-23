type startEnd = {
  start: string;
  end: string;
};

type WorkingHours = {
  monday: startEnd[];
  tuesday: startEnd[];
  wednesday: startEnd[];
  thursday: startEnd[];
  friday: startEnd[];
  saturday: startEnd[];
  sunday: startEnd[];
};

export default WorkingHours;
