import { Router } from "express";
import { auth } from "../middleware/auth";
import prisma from "../db";
import { createClient } from "@supabase/supabase-js";
import { requireRole } from "../middleware/role";

const router = Router();

let supabase: any = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}


router.get("/ManagerTasks", auth,requireRole("MANAGER", "PROJECT_MANAGER"), async (req, res) => {
  try {
    const employeeId = req.user!.id;

    // 1. Fetch tasks assigned to the logged-in employee
    const tasks = await prisma.task.findMany({
      where: { assigneeId: employeeId, isDeleted: false },
      include: {
        createdBy: true,
      },
      orderBy: { dueDate: "asc" },
    });

    // 2. Map manager files from Supabase
    const tasksWithFiles = tasks.map((task) => ({
  ...task,
  managerFiles: [],
  employeeFiles: [],
}));


    res.json({ tasks: tasksWithFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Employment Assignment

//* Get the user and Manager list
router.get("/Manager_employee_list", auth,requireRole("MANAGER", "PROJECT_MANAGER"), async (req, res) => {
  const userId = req.user!.id;

  try {
    const managers = await prisma.employee.findMany({
      where: {
        managerId: userId,
      },
      select: {
        name: true,
        roleTitle: true,
        department: true,

        user: {
          select: {
            id: true,

            ManagerEmployees: {
              select: {
                id: true,
                name: true,
                roleTitle: true,
                department: true,
                status: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({ managers });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
});

// Get all operators who are not assigned to any manager
router.get(
  "/employee-assign/new-joiners",
  auth,
  requireRole("PROJECT_MANAGER"), // only PM can see this
  async (req, res) => {
    try {
      const newJoiners = await prisma.employee.findMany({
        where: {
          managerId: null,
          user: {
            role: "OPERATOR",
          },
        },
        select: {
          id: true,
          name: true,
          roleTitle: true,
          department: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // You can send exactly what your UI needs
      res.status(200).json({ newJoiners });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch new joiners" });
    }
  }
);

// Assign an employee (operator) to a manager
router.post(
  "/employee-assign/assign",
  auth,
  requireRole("PROJECT_MANAGER"),
  async (req, res) => {
    try {
      // 1. Receive new name/dept from body
      const { employeeId, managerUserId, name, department } = req.body;

      if (!employeeId || !managerUserId) {
        return res
          .status(400)
          .json({ error: "employeeId and managerUserId are required" });
      }

      // 2. Validate Manager
      const managerUser = await prisma.user.findFirst({
        where: {
          id: managerUserId,
          role: { in: ["MANAGER", "PROJECT_MANAGER"] },
        },
      });

      if (!managerUser) {
        return res.status(404).json({ error: "Target Manager not found" });
      }

      // 3. Validate Employee
      const employee = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          user: { role: "OPERATOR" },
        },
      });

      if (!employee) {
        return res.status(404).json({ error: "Employee (operator) not found" });
      }

      // 4. Update & Assign
      // We update the name/department AND set the managerId
      const updatedEmployee = await prisma.employee.update({
        where: { id: employeeId },
        data: {
          managerId: managerUserId,
          name: name || employee.name, // Use new name if provided, else keep old
          department: department || employee.department, // Use new dept if provided
        },
      });

      res.status(200).json({
        message: "Employee details updated and assigned successfully",
        employee: updatedEmployee,
      });
    } catch (error: any) {
      console.error("Assignment Error:", error);
      res.status(500).json({ error: "Failed to assign employee" });
    }
  }
);

export default router;
