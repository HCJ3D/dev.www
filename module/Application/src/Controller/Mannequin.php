<?php
namespace Application\Controller;

use LeoGalleguillos\ThreeDimensions\Model\Table as ThreeDimensionsTable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Mannequin extends AbstractActionController
{
    public function __construct(
        ThreeDimensionsTable\Mannequin $mannequinTable
    ) {
        $this->mannequinTable = $mannequinTable;
    }

    public function updateWhereUserIdAction()
    {
        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
