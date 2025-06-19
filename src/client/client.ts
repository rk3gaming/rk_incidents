import lib from '@communityox/ox_lib/client';
import { Point } from '@communityox/ox_lib/client';
import { triggerServerCallback } from '@communityox/ox_lib/client';
import { initLocale, locale } from '@communityox/ox_lib/shared';

initLocale();

const config = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'config.json'));

lib.registerContext({
  id: 'police_reports_menu',
  title: locale('police_reports_menu_title'),
  options: []
});

async function updateReportsMenu() {
  try {
    const reports = await triggerServerCallback('rk_experimental:getReports', 1000) as any;
    
    if (reports && Array.isArray(reports) && reports.length > 0) {
      const options = reports.map((report: any) => ({
        title: `Report #${report.id} - ${report.your_name}`,
        description: locale('report_list_description', report.phone_number, new Date(report.created_at).toLocaleDateString()),
        icon: 'file-text',
        menu: `report_${report.id}_menu`
      }));

      lib.registerContext({
        id: 'police_reports_menu',
        title: locale('police_reports_menu_title'),
        options
      });

      reports.forEach((report: any) => {
        lib.registerContext({
          id: `report_${report.id}_menu`,
          title: `Report #${report.id}`,
          menu: 'police_reports_menu',
          options: [
            {
              title: locale('view_report'),
              description: locale('view_report_description'),
              icon: 'eye',
              onSelect: () => {
                lib.inputDialog(`${locale('report_details_title')} #${report.id}`, [
                  {
                    type: 'input',
                    label: locale('name_label'),
                    default: report.your_name,
                    disabled: true
                  },
                  {
                    type: 'input',
                    label: locale('phone_number_label_readonly'),
                    default: report.phone_number,
                    disabled: true
                  },
                  {
                    type: 'textarea',
                    label: locale('incident_description_label_readonly'),
                    default: report.incident_description,
                    disabled: true,
                    min: 3,
                    max: 10
                  }
                ], {
                  allowCancel: true
                });
              }
            },
            {
              title: locale('delete_report'),
              description: locale('delete_report_description'),
              icon: 'trash',
              onSelect: () => {
                lib.inputDialog(locale('delete_report_title'), [
                  {
                    type: 'input',
                    label: locale('delete_confirmation_label'),
                    description: locale('delete_confirmation_description'),
                    placeholder: 'DELETE',
                    required: true
                  }
                ], {
                  allowCancel: true
                }).then(async (confirmData) => {
                  if (confirmData && confirmData[0] === 'DELETE') {
                    const response = await triggerServerCallback('rk_experimental:deleteReport', 1000, report.id) as any;
                    if (response && response.success) {
                      lib.notify({
                        title: locale('success_title'),
                        description: locale('report_deleted_message'),
                        type: 'success'
                      });
                      await updateReportsMenu();
                      lib.showContext('police_reports_menu');
                    } else {
                      lib.notify({
                        title: locale('error_title'),
                        description: response?.message || locale('delete_error_message'),
                        type: 'error'
                      });
                    }
                  }
                });
              }
            }
          ]
        });
      });
    } else {
      lib.registerContext({
        id: 'police_reports_menu',
        title: locale('police_reports_menu_title'),
        options: [
          {
            title: locale('no_reports_title'),
            description: locale('no_reports_message'),
            icon: 'exclamation-triangle',
            disabled: true
          }
        ]
      });
    }
  } catch (error) {
    lib.registerContext({
      id: 'police_reports_menu',
      title: locale('police_reports_menu_title'),
      options: [
        {
          title: locale('no_permission_title'),
          description: locale('no_permission_message'),
          icon: 'lock',
          disabled: true
        }
      ]
    });
  }
}

function nearby(this: any) {
  if (this.currentDistance && this.currentDistance < 1 && IsControlJustReleased(0, 38)) {
    lib.inputDialog(locale('report_dialog_title'), [
      {
        type: 'input',
        label: locale('your_name_label'),
        description: locale('your_name_description'),
        icon: 'user',
        required: true
      },
      {
        type: 'input',
        label: locale('phone_number_label'),
        description: locale('phone_number_description'),
        icon: 'phone',
        required: true
      },
      {
        type: 'textarea',
        label: locale('report_description_label'),
        description: locale('report_description_description'),
        icon: 'file-lines',
        required: true,
        min: 3,
        max: 10,
        autosize: true
      }
    ], {
      allowCancel: true
    }).then(async (data) => {
      if (data) {
        const response = await triggerServerCallback('rk_experimental:submitReport', 1000, data[0], data[1], data[2]) as any;
        if (response && response.success) {
          lib.notify({
            title: locale('success_title'),
            description: locale('success_message'),
            type: 'success'
          });
        } else {
          lib.notify({
            title: locale('error_title'),
            description: response?.message || locale('error_message'),
            type: 'error'
          });
        }
      }
    })
  }
}

async function policeNearby(this: any) {
  if (this.currentDistance && this.currentDistance < 1 && IsControlJustReleased(0, 38)) {
    await updateReportsMenu();
    lib.showContext('police_reports_menu');
  }
}

config.ReportLocations.forEach((coords: number[], index: number) => {
  const point = new Point({
    coords: [coords[0], coords[1], coords[2]],
    distance: 2,
    nearby: nearby,
    args: {
      dunak: `point_${index}`
    }
  })
 
  point.onEnter = () => {
    lib.showTextUI(locale('textui_message'), {
      position: 'right-center',
      icon: 'file-pen'
    })
  }
 
  point.onExit = () => {
    lib.hideTextUI()
  }
})

config.PoliceLocations.forEach((coords: number[], index: number) => {
  const point = new Point({
    coords: [coords[0], coords[1], coords[2]],
    distance: 2,
    nearby: policeNearby,
    args: {
      dunak: `police_point_${index}`
    }
  })
 
  point.onEnter = () => {
    lib.showTextUI(locale('police_textui_message'), {
      position: 'right-center',
      icon: 'shield'
    })
  }
 
  point.onExit = () => {
    lib.hideTextUI()
  }
}) 